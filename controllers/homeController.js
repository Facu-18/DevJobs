const mostrarTrabajos = (req,res) =>{
    res.render('home', {
       nombrePagina: 'devJobs',
       tagLine: 'Encuentra trabajo',
       barra: true,
       boton: true
    })
}

export{
    mostrarTrabajos
}