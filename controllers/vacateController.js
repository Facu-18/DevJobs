import Vacante from "../models/Vacantes.js"
import { check, validationResult } from 'express-validator';
import multer from "multer";
import shortid from "shortid";
import {dirname} from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import { cerrarSesion } from "./usuarioController.js";

const formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        nombrePagina: 'Nueva Vacante',
        tagline: 'LLena el formulario y publica tu vacante',
        csrfToken: req.csrfToken(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

// agregar vacante
const agregarVacante = async (req, res) => {
    const vacante = new Vacante(req.body)

    // usuario autor de la vacante
    vacante.autor = req.user._id;

    //validando
    await check('titulo')
        .notEmpty().withMessage('El campo título es obligatorio')
        .trim().escape()
        .run(req);

    await check('empresa')
        .notEmpty().withMessage('El campo empresa es obligatorio')
        .trim().escape()
        .run(req);

    await check('ubicacion')
        .notEmpty().withMessage('El campo ubicación es obligatorio')
        .trim().escape()
        .run(req);

    await check('salario')
        .notEmpty().withMessage('El campo salario es obligatorio')
        .trim().escape()
        .run(req);

    await check('contrato')
        .notEmpty().withMessage('El campo contrato es obligatorio')
        .trim().escape()
        .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('nueva-vacante', {
            errores: errors.array(),
            vacante: req.body,
            csrfToken: req.csrfToken()
        });
    }

    // Crear arreglo de skills
    vacante.skills = req.body.skills.split(',')

    // almacenar en la base de datos
    const nuevaVacante = await vacante.save()

    // redireccion
    res.redirect(`/vacantes/${nuevaVacante.url}`)

}

const mostrarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');

    if (!vacante) {
        return next();
    }

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.validationResult,
        barra: true,
        csrfToken: req.csrfToken()
    })
}

const formEditarVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url })

    if (!vacante) {
        return next();
    }

    res.render('editar-vacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        csrfToken: req.csrfToken(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

const editarVacante = async (req, res, next) => {
    // Validando con Express-validator
    await check('titulo').notEmpty().withMessage('El campo título es obligatorio').trim().escape().run(req);
    await check('empresa').notEmpty().withMessage('El campo empresa es obligatorio').trim().escape().run(req);
    await check('ubicacion').notEmpty().withMessage('El campo ubicación es obligatorio').trim().escape().run(req);
    await check('salario').notEmpty().withMessage('El campo salario es obligatorio').trim().escape().run(req);
    await check('contrato').notEmpty().withMessage('El campo contrato es obligatorio').trim().escape().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('editar-vacante', {
            errores: errors.array(),
            vacante: req.body,
            csrfToken: req.csrfToken()
        });
    }

    // Preparar los datos actualizados de la vacante
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');

    try {
        // Encontrar la vacante por su URL y actualizarla
        const vacante = await Vacante.findOne({ url: req.params.url });

        if (!vacante) {
            return next(); // Si no se encuentra la vacante
        }

        // Actualizar los campos de la vacante
        vacante.titulo = vacanteActualizada.titulo;
        vacante.empresa = vacanteActualizada.empresa;
        vacante.ubicacion = vacanteActualizada.ubicacion;
        vacante.salario = vacanteActualizada.salario;
        vacante.contrato = vacanteActualizada.contrato;
        vacante.skills = vacanteActualizada.skills;

        // Guardar la vacante actualizada
        await vacante.save();

        // Redireccionar a la página de detalles de la vacante
        res.redirect(`/vacantes/${vacante.url}`);
    } catch (error) {
        // Manejar errores
        console.error('Error al editar la vacante:', error);
        req.flash('error', 'Hubo un error al editar la vacante');
        res.redirect('/admin');
    }
};

const eliminarVacante = async (req, res) => {
    const { id } = req.params

    const vacante = await Vacante.findById(id);

    if (verficarAutor(vacante, req.user)) {
        // Es el usuario
        await Vacante.findByIdAndDelete(id)
        res.status(200).send('Vacante eliminada correctamente')
    } else {
        //no permitido
        res.status(403).send('Error')
    }

    
}

const verficarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) {
        return false
    }
    return true
}

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


// Configuración de almacenamiento de Multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/cv'));
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        cb(null, `${shortid.generate()}.${extension}`);
    },
});
// Configuración de Multer
const configuracionMulter = {
    limits: {
        fileSize: 100000
    },
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no permitido'), false);
        }
    }
};

// Middleware de Multer para subir una sola imagen
const upload = multer(configuracionMulter).single('cv');

const subirCV = (req,res,next)=>{
    upload(req, res, function(error) {
        if(error){
            if (error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo es muy grande maximo 100kb')
                }else{
                    req.flash('error', error.message)
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('back')
            return;
        }else{
            return next();
        }
    });
};


//almacenar los candidatos en la base de datos
const contactar = async (req,res,next)=>{
    
    const errors = validationResult(req);
    await check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').trim().escape().run(req);
    await check('email').notEmpty().withMessage('El campo email es obligatorio').trim().escape().run(req);
    
    if (!errors.isEmpty()) {
        return res.render('vacante', {
            errores: errors.array(),
            vacante: req.body,
            csrfToken: req.csrfToken()
        });
    }
    const vacante = await Vacante.findOne({url: req.params.url})
    if(!vacante) return next();

    // todo esta bien construir el objeto
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }

    //alamacenar vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save()

    //mensaje flahs y redireccion
    req.flash('correcto', 'se envio correctamente')
    res.redirect('/')
}

const mostrarCandidatos = async (req,res,next)=>{
      const vacante = await Vacante.findById(req.params.id)

    if(vacante.autor != req.user._id.toString()){
        return next();
    }

    if(!vacante) return next();

    res.render('candidatos',{
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen: req.user.imagen,
        candidatos: vacante.candidatos
    })
    
}
export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    eliminarVacante,
    subirCV,
    contactar,
    mostrarCandidatos
}