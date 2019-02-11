'use strict'

let express = require('express');
let studentController = require('../controllers/studentController');
let teacherActionsController = require('../controllers/teacherActionsController');
let md_auth = require('../middlewares/authenticated')

let api = express.Router();
// CRUD Students
api.get('/getAllStudents', md_auth.ensureAuth, studentController.getAllStudents);
api.post('/newStudent', md_auth.ensureAuth, studentController.newStudent);
api.post('/editStudent/:id', md_auth.ensureAuth, studentController.editStudent);
api.post('/deleteStudent/:id', md_auth.ensureAuth, studentController.deleteStudent);

// Teacher Powers!!!
api.post('/assignateToStudent/:id', md_auth.ensureAuth, teacherActionsController.assignateToStudent);
api.post('/removeAssignation/:id', md_auth.ensureAuth, teacherActionsController.removeAssignation);
api.post('/searchStudents', md_auth.ensureAuth, teacherActionsController.searchStudents);

// Login
api.post('/login', teacherActionsController.login);

module.exports = api;