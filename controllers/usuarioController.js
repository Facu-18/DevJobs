import multer from 'multer'
import Usuario from '../models/Usuario.js'
import { check, validationResult } from 'express-validator'
import {dirname} from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import shortid from 'shortid';


// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)


// Configuración de almacenamiento de Multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads/perfiles'));
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
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no permitido'), false);
        }
    }
};

// Middleware de Multer para subir una sola imagen
const upload = multer(configuracionMulter).single('imagen');

// Middleware para manejar la carga de imágenes y errores
const subirImagen = (req, res, next) => {
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
            res.redirect('/admin')
            return;
        }else{
            return next();
        }
    });
};





const formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        csrfToken: req.csrfToken(),
        mensajes: req.flash(),
        
    })
}

const validarRegistro = async (req, res, next) => {
    // Validacion y sanitizacion...
    await check('nombre')
        .notEmpty().withMessage('El campo nombre es obligatorio')
        .trim().escape()
        .run(req);

    await check('email')
        .isEmail().withMessage('El formato no corresponde a un email')
        .normalizeEmail()
        .run(req);

    await check('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8 caracteres')
        .trim().escape()
        .run(req);

    await check('confirmar')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
        .trim().escape()
        .run(req);
     
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        // Si hay errores
        const erroresArray = errores.array();

        req.flash('error', erroresArray.map(error => error.msg));
        
        return res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en DevJobs',
            tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            csrfToken: req.csrfToken(),
            mensajes: req.flash(),
        });
    }

    next();  
};

const crearUsuario = async (req, res) => {
    // Crear usuario
    const usuario = new Usuario(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        // Manejar error y pasar mensaje al flash
        req.flash('error', error.message);
        return res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta en DevJobs',
            tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            csrfToken: req.csrfToken(),
            mensajes: req.flash(),
        });
    }
};
const formIniciarSesion = (req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesión devJobs',
        csrfToken: req.csrfToken()
    })
}

// Form editar perfil
const formEditarPerfil = (req,res)=>{
    res.render('editar-perfil',{
        nombrePagina : 'Edita tu perfil en devJobs',
        usuario: req.user,
        csrfToken: req.csrfToken(),
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

// Cerrar sesión
const cerrarSesion = (req,res)=>{
    req.logout(err =>{
      if(err){
       return next(err)
      }
      return res.redirect('/iniciar-sesion')
    });

    
}

// sanitizar y validar el form de editar perfiles
const validarPerfil = async (req,res,next)=>{
    await check('nombre')
       .notEmpty().withMessage('El campo nombre es obligatorio')
       .trim().escape()
       .run(req);
   
    await check('email')
       .isEmail().withMessage('El formato no corresponde a un email')
       .normalizeEmail()
       .run(req);
   
       if(req.body.password){
           await check('password')
           .isLength({ min: 8 }).withMessage('La contraseña debe tener un minimo de 8 caracteres')
           .trim().escape()
           .run(req);
       }
   
       const errores = validationResult(req);
   
       if (!errores.isEmpty()) {
           // Si hay errores
           const erroresArray = errores.array();
   
           req.flash('error', erroresArray.map(error => error.msg));
           
           return res.render('editar-perfil', {
               nombrePagina : 'Edita tu perfil en devJobs',
               usuario: req.user,
               csrfToken: req.csrfToken(),
               cerrarSesion: true,
               nombre: req.user.nombre,
           });
       }
   
       next();  
   };

// Guardar Cambios
const editarPerfil = async (req, res) => {
    try {
        // Accede al usuario actual desde req.user (asumiendo que está configurado correctamente por Passport u otro middleware de autenticación)
        const usuario = await Usuario.findById(req.user._id);
        
        if (!usuario) {
            // Manejo de error si el usuario no se encuentra
            return res.status(404).send('Usuario no encontrado');
        }
        
        // Actualiza los campos del usuario
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        
        if (req.body.password) {
            usuario.password = req.body.password;
        }
        
        if(req.file){
            usuario.imagen= req.file.filename
        }

        await usuario.save();
        
        // Flash message para indicar que los cambios se guardaron correctamente
        req.flash('correcto', 'Cambios guardados correctamente');
        
        // Redirige a la página de administración u otra ruta que necesite el csrfToken
        res.redirect('admin');
    } catch (error) {
        // Manejo de errores
        console.error('Error al editar perfil:', error);
        req.flash('error', 'Hubo un error al guardar los cambios');
        res.redirect('/editar-perfil');
    }
};



export {
    formCrearCuenta,
    crearUsuario,
    validarRegistro,
    formIniciarSesion,
    formEditarPerfil,
    editarPerfil,
    cerrarSesion,
    validarPerfil,
    subirImagen
    
}