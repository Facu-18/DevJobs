import express from 'express';
import {mostrarTrabajos} from '../controllers/homeController.js'
import { formularioNuevaVacante, agregarVacante, mostrarVacante, formEditarVacante, editarVacante, eliminarVacante, subirCV, contactar, mostrarCandidatos, buscarVacantes} from '../controllers/vacateController.js';
import {formCrearCuenta, crearUsuario, validarRegistro, formIniciarSesion, formEditarPerfil, editarPerfil, cerrarSesion, validarPerfil, subirImagen } from '../controllers/usuarioController.js'
import { autenticarUsuario, mostrarPanel, verificarUsuario,formReestablecerPassword,enviarToken,  reestablecerPassword, guardarPassword} from '../controllers/authController.js'

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

// Eliminar Vacantes
router.delete('/vacantes/eliminar/:id', eliminarVacante)

// Crear Cuentas
router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', validarRegistro, crearUsuario)

// Autenticar Usuarios
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

// Resetear passwords
router.get('/reestablecer-password', formReestablecerPassword)
router.post('/reestablecer-password', enviarToken)

// Resetear possword y almacenar
router.get('/reestablecer-password/:token', reestablecerPassword)
router.post('/reestablecer-password/:token', guardarPassword)

// Cerrar sesion
router.get('/cerrar-sesion', verificarUsuario, cerrarSesion)

// Panel de admin
router.get('/admin', verificarUsuario, mostrarPanel)

// Editar Perfil
router.get('/editar-perfil', verificarUsuario, formEditarPerfil)
router.post('/editar-perfil', verificarUsuario, validarPerfil, 
    subirImagen, editarPerfil)


// Recibir mensajes de candidatos
router.post('/vacantes/:url', subirCV, contactar)

// Muestra candidatos por vacantes
router.get('/candidatos/:id', verificarUsuario, mostrarCandidatos)

// Buscador de vacantes
router.post('/buscador', buscarVacantes)

export default router;