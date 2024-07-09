import passport from "passport"

const autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/ok',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

export{
    autenticarUsuario
}