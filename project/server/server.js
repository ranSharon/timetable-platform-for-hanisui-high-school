// ran
// JxzyMt12gkITSNcf
// mongodb+srv://ran:<password>@cluster0-hdnsl.mongodb.net/test?retryWrites=true

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dataRoutes = express.Router();
const PORT = 4000;

const Grade = require('./models/grades');
const Subject = require('./models/subjects');
const ClassRoom = require('./models/classRooms');
const Teacher = require('./models/teachers');
const Day = require('./models/days');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ran:JxzyMt12gkITSNcf@cluster0-hdnsl.mongodb.net/test?retryWrites=true');
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

dataRoutes.route('/getDays').get(function (req, res) {
    Day.find(function (err, days) {
        if (err) {
            console.log(err);
        } else {
            res.json(days);
        }
    });
});

dataRoutes.route('/addDay').post(function (req, res) {
    let day = new Day(req.body);
    day.save()
        .then(teacher => {
            //console.log(teacher);
            res.status(200).json(day);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getDay/:id').get(function (req, res) {
    let id = req.params.id;
    //console.log(id);
    Day.findById(id, function (err, day) {
        res.json(day);
    });
});

dataRoutes.route('/updateDay/:id').post(function (req, res) {
    Day.findById(req.params.id, function (err, day) {
        if (!day)
            res.status(404).send("data is not found");
        else {
            day.day = req.body.day;
            day.startTime = req.body.startTime;
            day.endTime = req.body.endTime;
        }
        day.save().then(day => {
            res.json(day);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dataRoutes.route('/deleteDay/:id').post(function (req, res) {
    let id = req.params.id;
    Day.findByIdAndRemove(id, (err, day) => {
        if (err) {
            return res.json({'message': 'Some Error' });
        }
        return res.json(day);
    })
});

dataRoutes.route('/getGrades').get(function (req, res) {
    Grade.find(function (err, grades) {
        if (err) {
            console.log(err);
        } else {
            res.json(grades);
        }
    });
});

dataRoutes.route('/addGrade').post(function (req, res) {
    let grade = new Grade(req.body);
    grade.save()
        .then(grade => {
            res.status(200).json(grade);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getGrade/:id').get(function (req, res) {
    let id = req.params.id;
    //console.log(id);
    Grade.findById(id, function (err, grade) {
        res.json(grade);
    });
});

dataRoutes.route('/updateGrade/:id').post(function (req, res) {
    Grade.findById(req.params.id, function (err, grade) {
        if (!grade)
            res.status(404).send("data is not found");
        else {
            grade.grade = req.body.grade;
            grade.numOfClasses = req.body.numOfClasses;
        }
        grade.save().then(grade => {
            res.json(grade);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dataRoutes.route('/deleteGrade/:id').post(function (req, res) {
    let id = req.params.id;
    Grade.findByIdAndRemove(id, (err, grade) => {
        if (err) {
            return res.json({'message': 'Some Error' });
        }
        return res.json(grade);
    })
});

dataRoutes.route('/getSubjects').get(function (req, res) {
    Subject.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

dataRoutes.route('/addSubject').post(function (req, res) {
    let subject = new Subject(req.body);
    subject.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getClassRooms').get(function (req, res) {
    ClassRoom.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

dataRoutes.route('/addClassRoom').post(function (req, res) {
    let classRoom = new ClassRoom(req.body);
    classRoom.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getTeachers').get(function (req, res) {
    Teacher.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

dataRoutes.route('/addTeacher').post(function (req, res) {
    let teacher = new Teacher(req.body);
    teacher.save()
        .then(teacher => {
            //console.log(teacher);
            res.status(200).json({ 'teacher': teacher });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getTeacher/:id').get(function (req, res) {
    let id = req.params.id;
    //console.log(id);
    Teacher.findById(id, function (err, teacher) {
        res.json(teacher);
    });
});

dataRoutes.route('/updateTeacher/:id').post(function (req, res) {
    Teacher.findById(req.params.id, function (err, teacher) {
        if (!teacher)
            res.status(404).send("data is not found");
        else {
            teacher.name = req.body.name;
            teacher.juniorHighSchool = req.body.juniorHighSchool;
            teacher.highSchool = req.body.highSchool;
            teacher.maxTeachHours = req.body.maxTeachHours;
            teacher.dayOff = req.body.dayOff;
            teacher.grades = [...req.body.grades];
            teacher.subjectsForTeacher = [...req.body.subjectsForTeacher];
        }
        teacher.save().then(teacher => {
            res.json(teacher);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dataRoutes.route('/deleteTeacher/:id').post(function (req, res) {
    let id = req.params.id;
    Teacher.findByIdAndRemove(id, (err, teacher) => {
        if (err) {
            return res.json({'message': 'Some Error' });
        }
        return res.json(teacher);
    })
});

app.use('/data', dataRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});