import passport from "passport"
import Vacante from "../models/Vacantes.js";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";
import crypto from 'crypto'

const autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/admin',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

// Revisar autenticaciond de usuario
const verificarUsuario = (req,res,next)=>{
    // revisar usuario
    if(req.isAuthenticated()){
        return next();
    }

    //redireccionar
    res.redirect('/iniciar-sesion')
}

const mostrarPanel = async (req,res) =>{
    // consultar el usuario autenticado
    const vacantes = await Vacante.find({autor: req.user._id})
    

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
const enviarToken = async(req,res)=>{
    const usuario = await Usuario.findOne({email: req.body.email})

    if(!usuario){
        req.flash('error', 'No existe esta cuenta')
        return res.render('iniciar-sesion')
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000

    //Guardar usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    res.render('aviso',{
        nombrePagina: 'Reestablecer Contraseña'
    })

    // TODO : enviar notificacion por email
}

const formReestablecerPassword = (req,res) => {
    res.render('reestablecer-password', {
        nombrePagina: 'Reestablece tu password',
        tagLine: 'Si ya tienes una cuenta pero olvidaste tu contraseña, escribe tu email',
        csrfToken: req.csrfToken()
    })
}

export{
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario,
    formReestablecerPassword,
    enviarToken
}