import Vacante from "../models/Vacantes.js"
import { check, validationResult } from 'express-validator';

const formularioNuevaVacante = (req,res) => {
   res.render('nueva-vacante', {
      nombrePagina: 'Nueva Vacante',
      tagline: 'LLena el formulario y publica tu vacante'
   })
}

// agregar vacante
const agregarVacante = async (req,res)=>{
   const vacante = new Vacante(req.body)

   await check('titulo').notEmpty().withMessage('El campo titulo es obligatorio').run(req);
   await check('empresa').notEmpty().withMessage('El campo empresa es obligatorio').run(req);
   await check('ubicacion').notEmpty().withMessage('El campo ubicación es obligatorio').run(req);
   await check('salario').notEmpty().withMessage('El campo salario es obligatorio').run(req);
   await check('contrato').notEmpty().withMessage('El campo contrato es obligatorio').run(req);
    
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.render('nueva-vacante', {
          errores: errors.array(),
          vacante: req.body
      });
  }

   // Crear arreglo de skills
   vacante.skills = req.body.skills.split(',')
   
   // almacenar en la base de datos
   const nuevaVacante = await vacante.save()

   // redireccion
   res.redirect(`/vacantes/${nuevaVacante.url}`)

}

export {
    formularioNuevaVacante,
    agregarVacante
}