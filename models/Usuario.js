import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import bcrypt, { compare } from 'bcrypt'

const usuariosSchema = new mongoose.Schema({
   nombre:{
      type: String,
      required: 'Agrega tu Nombre'
   },
   email :{
    type: String,
    unique: true,
    lowecase: true,
    trim: true
   },
   password: {
      type: String,
      required: true,
      trim: true

   },
   token: String,
   expira: Date,
   
});

// Hashear password
usuariosSchema.pre('save', async function(next){
    // Si el password esta hasheado
    if(!this.isModified('password')){
        return next();
    }
    // si no esta hasheado
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});
// Alerta de usuario registrado
usuariosSchema.post('save', function(error, doc, next) {
   if (error.name === 'MongoServerError' && error.code === 11000) {
       next(new Error('Ese correo ya está registrado'));
   } else {
       next(error);
   }
});


// Autenticar usuarios
usuariosSchema.methods = {
   compararPassoword: function(password){
      return bcrypt.compareSync(password, this.password)
   }
}

const Usuario = mongoose.model('Usuario', usuariosSchema);

export default Usuario;