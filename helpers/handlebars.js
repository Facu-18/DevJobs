import Handlebars from 'handlebars';

const seleccionarSkills = (seleccionadas = [], opciones) =>{
    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

    let html = '';
    skills.forEach(skill =>{
        html += `
         <li${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>`
    })

    return new Handlebars.SafeString(html);

}

const tipoContrato = (seleccionado, opciones) => {
    return opciones.fn(this).replace(
        new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
    )
}

const mostrarAlerta = (errores = {}, alertas = []) => {
    console.log(errores)
    console.log(alertas)

    
};


// Registrar el helper
Handlebars.registerHelper('seleccionarSkills', seleccionarSkills);
Handlebars.registerHelper('tipoContrato', tipoContrato);
Handlebars.registerHelper('mostrarAlerta', mostrarAlerta)

export{
    seleccionarSkills,
    tipoContrato,
    mostrarAlerta
}