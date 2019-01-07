const express = require('express');
const { verificaToken } = require('../middlewares/authentication');
const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate usuario y categoria
    //Paginado 

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cantidad: conteo
                });
            });
        });


});


app.get('/productos/:id', verificaToken, (req, res) => {
    //populate usuario y categoria    
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

/*
    Buscar productos
*/

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })

        });

});


app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponibe: body.disponibe,
        categoria: body.categoria,
        usuario: req.usuario
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });


});


app.put('/productos/:id', verificaToken, (req, res) => {
    //Actualizar producto    
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripción', 'categoria', 'disponible']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});


app.delete('/productos/:id', verificaToken, (req, res) => {
    //Deshabilitar el producto en disponible
    let id = req.params.id;
    let deshabilitar = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, deshabilitar, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: `Se ha deshabilitado el producto con id ${id}`
        })

    });
});

module.exports = app;