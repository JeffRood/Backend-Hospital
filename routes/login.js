var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var SEED = require('../config/config').SEED;
var Usuario = require("../models/Usuario");



app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales Incorrecta --mail',
                errors: err
            })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales Incorrecta -- password',
                errors: err
            })
        }

        // Crear un token
        usuarioDB.password = 'Sigue Intentando';
        var token = jwt.sign({ Usuario: usuarioDB },
                SEED, { expiresIn: 14400 }) //4 horas


        res.status(201).json({
            ok: true,
            Usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        })
    })



})






module.exports = app;