import Usuario from '../models/Usuario.js'
import { check, validationResult } from 'express-validator'

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

    if (errores) {
        // si hay errores
        const erroresArray = errores.array();

        console.log(erroresArray);
        req.flash('error', erroresArray.map(error => error.msg));

        req.flash('error', erroresArray.map(error => error.msg)); // Flash con array de errores validados
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
    //Crear usuario
    const usuario = new Usuario(req.body);
 
    try{
        await usuario.save();
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error', error => erroresArray.map(error => error.msg));
        return res.render('crear-cuenta', {
            nombrePagina: 'Error: Ese correo ya esta registrado',
            tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            csrfToken: req.csrfToken(),
            mensajes: req.flash(error),
        });
    }
}

const formIniciarSesion = (req,res)=>{
    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesión devJobs',
        csrfToken: req.csrfToken()
    })
}

export {
    formCrearCuenta,
    crearUsuario,
    validarRegistro,
    formIniciarSesion
}