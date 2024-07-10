import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js'
import { formularioNuevaVacante, agregarVacante, mostrarVacante, formEditarVacante, editarVacante,} from '../controllers/vacateController.js';
import {formCrearCuenta, crearUsuario, validarRegistro, formIniciarSesion } from '../controllers/usuarioController.js'
import { autenticarUsuario, mostrarPanel, verificarUsuario } from '../controllers/authController.js';

const router = express.Router();

router.get('/', mostrarTrabajos)

// Crear vacantes
router.get('/vacantes/nueva', verificarUsuario, formularioNuevaVacante)
router.post('/vacantes/nueva', verificarUsuario, agregarVacante)
    
// Mostrar Vacante
router.get('/vacantes/:url', mostrarVacante)

// Editar Vacante
router.get('/vacantes/editar/:url', verificarUsuario, formEditarVacante)
router.post('/vacantes/editar/:url', verificarUsuario, editarVacante)

// Crear Cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', validarRegistro, crearUsuario)

// Autenticar Usuarios
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

// Panel de admin
router.get('/admin', verificarUsuario, mostrarPanel)

export default router;