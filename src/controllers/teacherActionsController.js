'use strict'

const bcrypt = require('bcrypt-node'),
    teacher = require('../models/teacher'),
    student = require('../models/student'),
    tokens = require('../services/tokens')

function login(req, res) {
    let params = req.body;
    let $email = params.email;
    let password = params.password;

    teacher.findOne({email: $email}, (err, $teacher) => {
        if(err) return res.status(500).send({message: 'Internal error, try later. 1', error: err});
        if(!$teacher) return res.status(401).send({message: 'Login error, check your email and password. 1'});

        bcrypt.compare(password, $teacher.password, (err, check) => {
            if(err) return res.status(500).send({message: 'Internal error, try later.'})
            if(!check) return res.status(401).send({message: 'Login error, check your email and password.'});

            $teacher.password = undefined;
            return res.status(200).send({teacher: $teacher, token: tokens.createToken($teacher)});
        });
    });
}

function searchStudents(req, res) {
    let searchName = req.body.nameSearch;
    student.find({ $text: { $search: `\"${searchName}\"` } }, (err,  students) => {
        if(err) return res.status(500).send({message: 'Error with "Find" method'});

        return res.status(200).send({students});
    });
}

function assignateToStudent(req, res) {
    let studentId = req.params.id;
    let course = req.body.course;
    let contador = 0;

    student.findById(studentId, (err, studentToUpdate) => {
        if(err) return res.status(500).send({message: 'Fatal error in student search, try later.'})
        if(!studentToUpdate) return res.status(404).send({message: 'Student not found, please verify the ID'});

        if (studentToUpdate.courses) {
            studentToUpdate.courses.forEach(element => {
                if(removeSpecial(element).toLowerCase() === removeSpecial(course).toLowerCase()) contador++;
            });
        }
        
        if (!(contador > 0)) {
            studentToUpdate.courses.push(course);
            student.findByIdAndUpdate(studentId, studentToUpdate, {new:true}, (err, updatedStudent) => {
                if(err) return res.status(500).send({message: 'Fatal error, try later.'});
                if(!updatedStudent) res.status(500).send({message: 'Cant update, try later.'});

                return res.status(200).send({student: updatedStudent});
            });
        } else {
            return res.status(500).send({message: `This students already has the course '${removeSpecial(course)}'`,});
        }
    });
}

function removeAssignation(req, res) {
    let studentId = req.params.id;
    let course = req.body.course;

    student.findById(studentId, (err, studentToUpdate) => {
        if(err) return res.status(500).send({message: 'Fatal error in student search, try later.'})
        if(!studentToUpdate) return res.status(404).send({message: 'Student not found, please verify the ID'});

        if (studentToUpdate.courses.length == 0) {
            return res.status(200).send({message: 'No courses to remove.'})
        }

        for (let index = 0; index < studentToUpdate.courses.length ; index++){
            if (removeSpecial(studentToUpdate.courses[index ]) === removeSpecial(course)) {
                studentToUpdate.courses.splice(index, 1);
            }
        }

        student.findByIdAndUpdate(studentId, studentToUpdate, {new:true}, (err, updatedStudent) => {
            if(err) return res.status(500).send({message: 'Fatal error, try later.'});
            if(!updatedStudent) res.status(500).send({message: 'Cant update, try later.'});

            return res.status(200).send({student: updatedStudent});
        });
    });
}

function removeSpecial(texto){

    if (texto == null) {
        return '';
    } else {
        return texto
           .normalize('NFD')
           .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
           .normalize();

           // texto.normalize()
    }
} 

module.exports = {
    login,
    searchStudents,
    assignateToStudent,
    removeAssignation
};