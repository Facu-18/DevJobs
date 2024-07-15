import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import slug from "slug";
import shortid from "shortid";

const vacantesSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacante es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true,
    },
    contrato: {
        type: String,
        trim: true,
    },
    descripcion : {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: 'El autor es obligatorio'
    }
})
vacantesSchema.pre('save', function(next){
    // Crear la url
    const url = slug(this.titulo);
    this.url= `${url}-${shortid.generate()}`;
    next();
})

// Crear indice
vacantesSchema.index({titulo: 'text'})

const Vacante = mongoose.model('Vacante', vacantesSchema);

export default Vacante;