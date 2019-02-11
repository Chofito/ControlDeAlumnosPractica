'use strict'

let mongoose = require('mongoose');
 let teacherSchema =mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    email: { 
        type: String, 
        unique: true,
        index: true, 
        required: [true, 'Email address is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    }
}, { collation: { locale: 'es', strength: 2 } });

teacherSchema.index({email: 1});

module.exports = mongoose.model('teachers', teacherSchema);