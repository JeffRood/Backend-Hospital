// Importar el express
var express = require('express');
var app = express();
// para buscar tenemos que exportar los modelos
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ===============================================
// Busca en coleccion
//================================================ 
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    //parametro url 
    var regex = new RegExp(busqueda, 'i');
    // Expresion  para que sea insencible a las mayuscula y miniscula
    var promesa;
    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex)
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuario, Medico y Hospital',
                error: { message: 'Tipos de tablas/Coleccion no valido' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: tabla

        })

    });
});



// ===============================================
// Busqueda generalsd 
//================================================ 

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    // Expresion regular
    var regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
        // recibe un arreglo con los valores o respuestas
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });

});

// Promesa para buscar hospitales

function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }).populate('usuario', 'nombre email').exec((err, hospitales) => {
            if (err) {
                reject('error al cargar hospitales', err);
            }
            resolve(hospitales);

        });
    });

};
// Promesa para buscar medicos
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }).populate('usuario', 'nombre email').populate('hospital').exec((err, medicos) => {
            if (err) {
                reject('error al cargar medicos', err);
            }
            resolve(medicos);

        });
    });

};
// Promesa para buscar usuarios
// function buscarUsuarios(busqueda, regex) {

//     return new Promise((resolve, reject) => {
//         Usuario.find({}, 'nombre email role').or([{ 'nombre': regex }, { 'email': regex }]).exec((err, usuarios) => {
//             if (err) {
//                 reject('Error al cargar usuarios', err)
//             }
//             resolve(usuarios);

//         })

//     })
// };


module.exports = app;