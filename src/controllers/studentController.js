'use strict'

const student = require('../models/student');

function newStudent(req, res) {
    let params = req.body;
    let tempStudent = new student(params);
    let validate = tempStudent.validateSync();

    if (!validate) {
        student.find({email: tempStudent.email}).exec((err, students) => {
            if(err) return res.status(500).send({message: 'Internal error with the database "find".'});
            if(students && students.length >= 1) return res.status(500).send({message: 'There is already a student with that email'});

            tempStudent.save((err, studentSaved) => {
                if(err) return res.status(500).send({message: 'Internal error in save method,'});
                if(!studentSaved) return res.status(400).send({message: 'Unknown error with user save method.'});

                return res.status(200).send({student: studentSaved});
            });
        });
    } else {
        res.status(200).send({message: 'Fill al the fields (name and email)', fields: validate.message});
    }
}

function editStudent(req, res){
    var studentId = req.params.id;
    var params = req.body;

    if (params.email) {
        student.find({email: params.email}).exec((err, students) => {
            if(err) return res.status(500).send({message: 'Internal error with the database "find".'});
            if(students && students.length >= 1) return res.status(500).send({message: 'There is already a student with that email'});

            student.findByIdAndUpdate(studentId, params, {new:true}, (err, updatedStudent)=>{
                if(err) return res.status(500).send({message: 'Internal error, try later.'})
                
                if(!updatedStudent) return res.status(404).send({message: 'Error in student edit method.'})
        
                return res.status(200).send({updatedStudent})
            });
        });
    } else {
        student.findByIdAndUpdate(studentId, params, {new:true}, (err, updatedStudent)=>{
            if(err) return res.status(500).send({message: 'Internal error, try later.'})
            
            if(!updatedStudent) return res.status(404).send({message: 'Error in student edit method.'})
    
            return res.status(200).send({updatedStudent})
        });
    }
}

function getAllStudents(req, res) {
    student.find({}, (err, students) => {
        if(err) return res.status(500).send({message: 'Internal error, try later.'});

        return res.status(200).send({students})
    });
}

function deleteStudent(req, res) {
    student.findByIdAndRemove(req.params.id, (err, student) => {
        if (err) return res.status(500).send(err);

        return res.status(200).send({message: 'Student successfully deleted'});
    });
}

module.exports = {
    newStudent,
    editStudent,
    getAllStudents,
    deleteStudent
};