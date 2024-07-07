import mongoose from 'mongoose';
import db from './config/db.js'
import express from 'express';
import appRoutes from './routes/appRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo'; 


dotenv.config({path: '.env'});

// Obtener el equivalente a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Habilitar handlebars
app.engine('handlebars',
    exphbs.engine({defaultLayout:'layout'}));

app.set('view engine', 'handlebars');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongooseConnection : mongoose.connection,
        mongoUrl: process.env.DATABASE,
        collectionName: 'session', }),
        
}));

app.use('/', appRoutes);

app.listen(process.env.PORT);