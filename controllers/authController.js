import passport from "passport"

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
    res.render('administracion', {
        nombrePagina: 'Panel de Administración',
        tagLine: 'Crea y Administra tus vacantes desde aqui'
    })
}


export{
    autenticarUsuario,
    mostrarPanel,
    verificarUsuario
}