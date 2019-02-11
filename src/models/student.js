'use strict'

let mongoose = require('mongoose');

let studentSchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
        required: [true, 'Name is required.']
    },
    email: { 
        type: String, 
        unique: true,
        index: true, 
        required: [true, 'Email address is required']
    },
    courses: {
        type: [String]
    }
}, { collation: { locale: 'es', strength: 1 } });

studentSchema.index({name: 'text', email: 1});

module.exports = mongoose.model('students', studentSchema);