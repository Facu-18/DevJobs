import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js'
import { formularioNuevaVacante, agregarVacante, mostrarVacante, formEditarVacante, editarVacante,} from '../controllers/vacateController.js';
import {formCrearCuenta, crearUsuario, validarRegistro, formIniciarSesion } from '../controllers/usuarioController.js'
import { autenticarUsuario } from '../controllers/authController.js';

const router = express.Router();

router.get('/', mostrarTrabajos)

// Crear vacantes
router.get('/vacantes/nueva', formularioNuevaVacante)
router.post('/vacantes/nueva', agregarVacante)
    
// Mostrar Vacante
router.get('/vacantes/:url', mostrarVacante)

// Editar Vacante
router.get('/vacantes/editar/:url', formEditarVacante)
router.post('/vacantes/editar/:url', editarVacante)

// Crear Cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', validarRegistro, crearUsuario)

// Autenticar Usuarios
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

export default router;