/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/js/app.js":
/*!**************************!*\
  !*** ./public/js/app.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener('DOMContentLoaded', ()=>{\r\n    const skills = document.querySelector('.lista-conocimientos');\r\n\r\n    // Limpiar las alertas\r\n    let alertas = document.querySelector('.alertas');\r\n\r\n    if(alertas){\r\n      limpiarAlertas();\r\n    }\r\n    \r\n    if(skills){\r\n        skills.addEventListener('click', agregarSkills);\r\n\r\n        // llamar funcion en editar\r\n        skillsSeleccionados();\r\n    }\r\n})\r\n\r\nconst skills = new Set();\r\n\r\nconst agregarSkills = (e)=>{\r\n    if(e.target.tagName === 'LI'){\r\n      if(e.target.classList.contains('activo')){\r\n        //quitarlo del set\r\n        skills.delete(e.target.textContent)\r\n        e.target.classList.remove('activo');\r\n      }\r\n      else{\r\n        //agregar al set\r\n        skills.add(e.target.textContent)\r\n        e.target.classList.add('activo');\r\n      }\r\n    }\r\n    const skillsArray = [...skills]\r\n    document.querySelector('#skills').value = skillsArray;\r\n}\r\n\r\nconst skillsSeleccionados = ()=>{\r\n  const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'))\r\n  \r\n  seleccionadas.forEach(seleccionada =>{\r\n    skills.add(seleccionada.textContent)\r\n  })\r\n\r\n  // leerlo en el hidden\r\n  const skillsArray = [...skills]\r\n  document.querySelector('#skills').value = skillsArray;\r\n\r\n}\r\n\r\nconst limpiarAlertas = () =>{\r\n  const alertas = document.querySelector('.alertas');\r\n  const interval = setInterval(()=>{\r\n    if(alertas.children.length > 0){\r\n      alertas.removeChild(alertas.children[0])\r\n   }else if(alertas.children.length === 0){\r\n      alertas.parentElement.removeChild(alertas)\r\n      clearInterval(interval)\r\n   }\r\n  }, 4000)\r\n}\n\n//# sourceURL=webpack://devjobs/./public/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./public/js/app.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;