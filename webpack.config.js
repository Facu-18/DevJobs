import path from 'path';

// Define la configuración de Webpack
const config = {
  mode: 'development', // Cambia a 'production' para el entorno de producción
  entry: './public/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('public/dist')
  }
};

export default config;
