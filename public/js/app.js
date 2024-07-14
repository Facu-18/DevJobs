import axios from "axios";
import { header } from "express-validator";
import Swal from "sweetalert2";

document.addEventListener('DOMContentLoaded', ()=>{
    const skills = document.querySelector('.lista-conocimientos');

    // Limpiar las alertas
    let alertas = document.querySelector('.alertas');

    if(alertas){
      limpiarAlertas();
    }
    
    if(skills){
        skills.addEventListener('click', agregarSkills);

        // llamar funcion en editar
        skillsSeleccionados();
    }

    const vacantesListado = document.querySelector('.panel-administracion')
     
    if(vacantesListado){
      vacantesListado.addEventListener('click',accionesListado)
    }
})

const skills = new Set();

const agregarSkills = (e)=>{
    if(e.target.tagName === 'LI'){
      if(e.target.classList.contains('activo')){
        //quitarlo del set
        skills.delete(e.target.textContent)
        e.target.classList.remove('activo');
      }
      else{
        //agregar al set
        skills.add(e.target.textContent)
        e.target.classList.add('activo');
      }
    }
    const skillsArray = [...skills]
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = ()=>{
  const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'))
  
  seleccionadas.forEach(seleccionada =>{
    skills.add(seleccionada.textContent)
  })

  // leerlo en el hidden
  const skillsArray = [...skills]
  document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = () =>{
  const alertas = document.querySelector('.alertas');
  const interval = setInterval(()=>{
    if(alertas.children.length > 0){
      alertas.removeChild(alertas.children[0])
   }else if(alertas.children.length === 0){
      alertas.parentElement.removeChild(alertas)
      clearInterval(interval)
   }
  }, 4000)
}

//eliminar vacante
const accionesListado = (e) => {
  if (e.target.dataset.eliminar) {
    // Preguntar al usuario antes de eliminar
    Swal.fire({
      title: "¿Quieres eliminar la vacante?",
      text: "Una vez eliminada, no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Obtener el token CSRF del DOM
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
         
        const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

        // Axios para eliminar el registro, incluyendo el token CSRF en la cabecera
        axios.delete(url, {
          headers: {
            'X-CSRF-Token': csrfToken
          },
          params: { url }
        }).then(function(respuesta){
          if(respuesta.status === 200){
            Swal.fire({
              title: "Eliminado",
               text: respuesta.data,
               icon: "success"
            });
          
             // Eliminar del dom
             e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
          }
          
        }).catch(function(error){
          Swal.fire({
            type: 'error',
            title: 'Hubo un error',
            text: 'No se pudo eliminar'
          })
          
        });
      }
    });
  } else if(e.target.tagName === 'A') {
    window.location.href = e.target.href;
  }
};
