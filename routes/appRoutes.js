import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js'
import { formularioNuevaVacante } from '../controllers/vacateController.js';


const router = express.Router();

router.get('/', mostrarTrabajos)

// Crear vacantes
router.get('/vacantes/nueva', formularioNuevaVacante)
    


export default router;