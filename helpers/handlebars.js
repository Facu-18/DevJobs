import Handlebars from 'handlebars';

const seleccionarSkills = (seleccionadas = [], opciones) =>{
    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

    let html = '';
    skills.forEach(skill =>{
        html += `
        <li>${skill}</li>`
    })

    return new Handlebars.SafeString(html);
}

// Registrar el helper
Handlebars.registerHelper('seleccionarSkills', seleccionarSkills);

export{
    seleccionarSkills
}