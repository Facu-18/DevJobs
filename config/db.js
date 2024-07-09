import mongoose from "mongoose";
import dotenv from 'dotenv';

// Importando modelos
import Vacante from "../models/Vacantes.js";
import Usuario from "../models/Usuario.js";

dotenv.config({path: '.env'});

mongoose.connect(process.env.DATABASE)
const db = mongoose.connection.on('error', (error)=>{
    console.log(error);
})





export default db;