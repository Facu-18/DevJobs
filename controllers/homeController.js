import Vacante from '../models/Vacantes.js'

const mostrarTrabajos = async (req,res,next) =>{
    
    const vacantes = await Vacante.find()
        
        if(!vacantes){
             return next();
        } 


    res.render('home', {
       nombrePagina: 'devJobs',
       tagLine: 'Encuentra trabajo',
       barra: true,
       boton: true,
       vacantes
    })
}

export{
    mostrarTrabajos
}