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
import bodyParser from 'body-parser'
import MongoStore from 'connect-mongo';
import csrf from 'csurf'; 
import {seleccionarSkills} from './helpers/handlebars.js'
import flash from 'connect-flash'
import { body, validationResult } from 'express-validator';
import passport from './config/passport.js';

dotenv.config({path: '.env'});

// Obtener el equivalente a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Habilitar handlebars
app.engine(
    'handlebars',
    exphbs.engine({
      defaultLayout: 'layout',
      helpers: { seleccionarSkills },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );

app.set('view engine', 'handlebars');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

// Habilitar csrf
app.use(csrf({cookie: true}))

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongooseConnection : mongoose.connection,
        mongoUrl: process.env.DATABASE,
        collectionName: 'session', }),
        
}));

// Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

// Alertas y mensajes
app.use(flash());

// middleware
app.use((req, res, next)=>{
  res.locals.mensajes = req.flash();
  next();
});

app.use('/', appRoutes);

app.listen(process.env.PORT);