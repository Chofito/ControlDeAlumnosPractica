'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'adasdguqhdb2bdb987sayf0-00-sf-9sdhfna';

exports.createToken = function(teacher) {
    let payload = {
        sub: teacher._id,
        name: teacher.name,
        email: teacher.email,
        iat: moment().unix(),
        exp: moment().day(30, 'days').unix(),
    };

    return jwt.encode(payload, secret);
}