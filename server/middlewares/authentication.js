const jwt = require('jsonwebtoken');
/*
================
Verificar Token
================
 */

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Authorization
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;

        next();



    });

};


//========================
// Verifica AdminRole
//========================

let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Se requieren permisos de administrador para realizar esta acción'
            }
        });
    } else {
        next();
    }


}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}