// Requires

var express = require('express');
var mongooses = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar Variable

var app = express();

//Body Parser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Conexion a la base de datos 

mongooses.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})

// Importar Rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuarios');
var loginsRoutes = require('./routes/login');

//Rutas

app.use('/usuarios', usuariosRoutes);
app.use('/login', loginsRoutes);
app.use('/', appRoutes);
//Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express Server puerto 3000: \x1b[32m%s\x1b[0m', 'online')
})