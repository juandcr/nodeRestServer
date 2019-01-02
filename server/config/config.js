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
    urlDB = 'mongodb://cafeUser:123456ABC@ds147344.mlab.com:47344/cafe'
}

process.env.URLDB = urlDB;