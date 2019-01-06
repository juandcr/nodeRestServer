require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// hacer publico la carpeta public 
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración de rutas
app.use(require('./routes/index'));

let opciones = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(process.env.URLDB, opciones, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log("escuchando puerto", process.env.PORT);
});