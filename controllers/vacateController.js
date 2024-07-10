import Vacante from "../models/Vacantes.js"
import { check, validationResult } from 'express-validator';

const formularioNuevaVacante = (req,res) => {
   res.render('nueva-vacante', {
      nombrePagina: 'Nueva Vacante',
      tagline: 'LLena el formulario y publica tu vacante',
      csrfToken: req.csrfToken()
   })
}

// agregar vacante
const agregarVacante = async (req,res)=>{
   const vacante = new Vacante(req.body)

   // usuario autor de la vacante
   vacante.autor = req.user._id;

   //validando
   await check('titulo').notEmpty().withMessage('El campo titulo es obligatorio').run(req);
   await check('empresa').notEmpty().withMessage('El campo empresa es obligatorio').run(req);
   await check('ubicacion').notEmpty().withMessage('El campo ubicación es obligatorio').run(req);
   await check('salario').notEmpty().withMessage('El campo salario es obligatorio').run(req);
   await check('contrato').notEmpty().withMessage('El campo contrato es obligatorio').run(req);
    
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

const mostrarVacante = async (req,res,next)=>{
    const vacante = await Vacante.findOne({url: req.params.url});

    if(!vacante){
      return next();
    }

    res.render('vacante',{
      vacante,
      nombrePagina: vacante.validationResult,
      barra: true,
      csrfToken: req.csrfToken()
    })
}

const formEditarVacante = async (req,res,next) =>{
   const vacante = await Vacante.findOne({url: req.params.url})

   if(!vacante){
      return next();
   }

   res.render('editar-vacante',{
      vacante,
      nombrePagina : `Editar - ${vacante.titulo}`,
      csrfToken: req.csrfToken()
   })
}

const editarVacante = async (req,res)=>{
   const vacanteActualizada = req.body
   
   vacanteActualizada.skills = req.body.skills.split(',')

   const vacante = await Vacante.findOneAndUpdate({url: req.params.url},vacanteActualizada, {
      new: true,
      runValidators: true
   })

   if(!vacante){
      return next();
   }

   res.redirect(`/vacantes/${vacante.url}`)


}

export {
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante
}