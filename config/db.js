import mongoose from "mongoose";
import dotenv from 'dotenv';

// Importando modelos
import Vacante from "../models/Vacantes.js";

dotenv.config({path: '.env'});

mongoose.connect(process.env.DATABASE, {useUnifiedTopology:true})
const db = mongoose.connection.on('error', (error)=>{
    console.log(error);
})





export default db;