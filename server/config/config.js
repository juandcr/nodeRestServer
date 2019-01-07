/**
 * ========================
 * Puerto
 * ========================
 */

process.env.PORT = process.env.PORT || 3000;


/**
 * ============
 * ENTORNO
 * =========
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/*
===============
Base de datos
===============
*/

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB;

/*
===============
Vencimiento del token
===============
60 segundos
60 minutos
24 horas
30 días
*/

process.env.CADUCIDAD_TOKEN = '48h';

/*
===============
SEED de autenticación
===============
*/

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

/*
googgle client
*/

process.env.CLIENTID = process.env.CLIENT_ID || ' 112266426972-96099ffucbq9t1mt9gif75tcg3ne4034.apps.googleusercontent.com';