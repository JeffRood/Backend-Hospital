var express = require('express');
var bcrypt = require('bcryptjs');
var seed = require('../config/config').SEED;
var app = express();
var mdAutenticacion = require('../middlewares/autentificacion');
var jwt = require('jsonwebtoken');
var Usuario = require("../models/Usuario");

// ========================================
// Obtener todos los Usuarios
// ========================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email role').exec(
        (err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarios
            });
        })
});


// ========================================
// Actualizar Usuario
// ========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'No existe',
                errors: { message: 'No exite un usuario con ese id' }
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })

            }
            usuarioGuardado.password = 'intente de nuevo';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });



    });

});




// ========================================
// Crear un nuevo usuario
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        role: body.role
    })
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });

        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            token: req.usuario
        });


    });

});

// ========================================
// Eliminar un usuario por id
// ========================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })

        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });


    })


});


module.exports = app;