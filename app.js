// Requires

var express = require('express');
var mongooses = require('mongoose')

//Inicializar Variable

var app = express();
// Conexion a la base de datos 

mongooses.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
})

// Rutas 
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion Realizada Corretacmente'
    });

})

//Escuchar Peticiones

app.listen(3000, () => {
    console.log('Express Server puerto 3000: \x1b[32m%s\x1b[0m', 'online');

})