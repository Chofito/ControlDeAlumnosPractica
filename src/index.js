'use strict'

let mongoose = require('mongoose'),
    teacher = require('./models/teacher'),
    app = require('./app');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ControlAlumnos2015567', {useNewUrlParser: true}).then(() => {
    console.log('Successful connection to the database');

    app.set('port', process.env.Port || 3000);

    app.listen(app.get('port'), () => {
        console.log(`The server is running in the port '${app.get('port')}'`);
    });

    teacher.findOne({name: 'Rodolfo Robles'}, (err, admin) => {
        if (!admin) {
            let admin = new teacher();
            admin.name = 'Rodolfo Robles';
            admin.email = 'rjroblesq@gmail.com';
            admin.password = '$2a$10$WTWnO01NBv7COHIFXjw2H.wwoQhiqjon5LO25b4YHxYkz6DdyUlIC';

            admin.save();
        }
    });
}).catch((err) => console.log(err));