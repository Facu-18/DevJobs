import passport from "passport"
import Vacante from "../models/Vacantes.js";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import crypto from 'crypto'
import emailOlvidePassword from '../config/email.js';



const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

// Revisar autenticaciond de usuario
const verificarUsuario = (req, res, next) => {
    // revisar usuario
    if (req.isAuthenticated()) {
        return next();
    }

    //redireccionar
    res.redirect('/iniciar-sesion')
}

const mostrarPanel = async (req, res) => {
    // consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id })


    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagLine: 'Crea y Administra tus vacantes desde aqui',
        vacantes,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen

    })
}

// Generar token en la tabla de usuarios
const enviarToken = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.body.email });

        if (!usuario) {
            req.flash('error', 'No existe esta cuenta');
            return res.render('iniciar-sesion');
        }

        // El usuario existe, generar token
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expira = Date.now() + 3600000;

        // Guardar usuario
        await usuario.save();
        const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

        // Enviar correo con el token
        await emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
            resetUrl: resetUrl
        });

        // Mostrar aviso después de enviar el correo
        res.render('aviso', {
            nombrePagina: 'Reestablecer Contraseña',
            mensaje: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.'
        });

    } catch (error) {
        console.error(error);
        req.flash('error', 'Hubo un error al procesar tu solicitud, intenta de nuevo');
        res.redirect('/reestablecer-password');
    }
};
const formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagLine: 'Si ya tienes una cuenta pero olvidaste tu contraseña, escribe tu email',
        csrfToken: req.csrfToken()
    })
}


// Valida si el token es válido y el usuario existe, muestra la vista
const reestablecerPassword = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            token: req.params.token,
            expira: {
                $gt: Date.now()
            }
        });

        if (!usuario) {
            req.flash('error', 'El formulario ya no es válido, intenta de nuevo');
            return res.redirect('/reestablecer-password');
        }

        // Todo está bien, mostrar formulario
        res.render('nuevo-password', {
            nombrePagina: 'Nueva Contraseña',
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Hubo un error al procesar tu solicitud, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }
};

// almacenar en la BD
const guardarPassword = async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            token: req.params.token,
            expira: {
                $gt: Date.now()
            }
        });

        // no existe el usuario o el token es invalido
        if (!usuario) {
            req.flash('error', 'El formulario ya no es válido, intenta de nuevo');
            return res.redirect('/reestablecer-password');
        }

        // guardar en la BD
        usuario.password = req.body.password;
        usuario.token = undefined;
        usuario.expira = undefined;

        await usuario.save()

        res.render('exito',{
            nombrePagina: 'exito'
        })
    }
    catch (error) {
       console.log(error)
    }
}

    export {
        autenticarUsuario,
        mostrarPanel,
        verificarUsuario,
        formReestablecerPassword,
        enviarToken,
        reestablecerPassword,
        guardarPassword
    }