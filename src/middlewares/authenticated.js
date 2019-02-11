'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'adasdguqhdb2bdb987sayf0-00-sf-9sdhfna';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'Cabecera de autenticacion erronea'});
    }

    let token = req.headers.authorization.replace(/[""]+/g, '');
    let payload = null;
    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message: 'El token ha expirado'});
        }
    } catch (error) {
        return res.status(404).send({message: 'El token no es valido'});
    }

    req.user = payload;

    next();
}