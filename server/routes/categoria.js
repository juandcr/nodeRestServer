const express = require('express');
let { verificaToken } = require('../middlewares/authentication');
const { verificaAdmin_Role } = require('../middlewares/authentication')
let app = express();
const _ = require('underscore');
let Categoria = require('../models/categoria');


//Mostrar todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res, status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    encontrados: conteo
                });
            });
        });

});


//Mostrar una categoria por ID
app.get('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });

        }
        res.json({
            ok: true,
            categoria
        });

    });
});


//Crear nueva categoria
app.post('/categoria/', [verificaToken], (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id    
    let body = req.body;
    let usuario = req.usuario;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario
    });
    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

//Actualizar categoria (descripcion)
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});


//borrar categoria
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo un administrador puede borrar categorias
    // Fisicamente que se borre
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        })
    });

});


module.exports = app;