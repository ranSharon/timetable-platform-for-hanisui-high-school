// ran
// JxzyMt12gkITSNcf
// mongodb+srv://ran:<password>@cluster0-hdnsl.mongodb.net/test?retryWrites=true

const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dataRoutes = express.Router();
const keys = require('./config/keys');
const PORT = process.env.PORT || 4000;

const Grade = require('./models/grades');
const Subject = require('./models/subjects');
const ClassRoom = require('./models/classRooms');
const Teacher = require('./models/teachers');
const Day = require('./models/days');
const RoomFeature = require('./models/roomFeature');
const Constraint = require('./models/constraint');
const TimeTable = require('./models/timeTable');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(keys.mongoURI, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
});

// static files
app.use(express.static(path.join(__dirname, '../build')));

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
            res.status(200).json(day);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getDay/:id').get(function (req, res) {
    let id = req.params.id;
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
            return res.json({ 'message': 'Some Error' });
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
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(grade);
    })
});

dataRoutes.route('/getClassRooms').get(function (req, res) {
    ClassRoom.find(function (err, classRoom) {
        if (err) {
            console.log(err);
        } else {
            res.json(classRoom);
        }
    });
});

dataRoutes.route('/addClassRoom').post(function (req, res) {
    let classRoom = new ClassRoom(req.body);
    classRoom.save()
        .then(classRoom => {
            res.status(200).json(classRoom);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getClassRoom/:id').get(function (req, res) {
    let id = req.params.id;
    ClassRoom.findById(id, function (err, classRoom) {
        res.json(classRoom);
    });
});

dataRoutes.route('/updateClassRoom/:id').post(function (req, res) {
    ClassRoom.findById(req.params.id, function (err, classRoom) {
        if (!classRoom)
            res.status(404).send("data is not found");
        else {
            classRoom.classRoomName = req.body.classRoomName;
            classRoom.classRoomFeatures = [...req.body.classRoomFeatures];
        }
        classRoom.save().then(classRoom => {
            res.json(classRoom);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dataRoutes.route('/deleteClassRoom/:id').post(function (req, res) {
    let id = req.params.id;
    ClassRoom.findByIdAndRemove(id, (err, classRoom) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(classRoom);
    })
});

dataRoutes.route('/getRoomFeatures').get(function (req, res) {
    RoomFeature.find(function (err, roomFeature) {
        if (err) {
            console.log(err);
        } else {
            res.json(roomFeature);
        }
    });
});

dataRoutes.route('/addRoomFeature').post(function (req, res) {
    let roomFeature = new RoomFeature(req.body);
    roomFeature.save()
        .then(roomFeature => {
            res.status(200).json(roomFeature);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/deleteRoomFeature/:roomFeature').post(function (req, res) {
    let name = req.params.roomFeature;
    RoomFeature.findOneAndDelete({ roomFeature: name }, (err, roomFeature) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(roomFeature);
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
        .then(subject => {
            res.status(200).json(subject);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getSubject/:id').get(function (req, res) {
    let id = req.params.id;
    Subject.findById(id, function (err, subject) {
        res.json(subject);
    });
});

dataRoutes.route('/updateSubject/:id').post(function (req, res) {
    Subject.findById(req.params.id, function (err, subject) {
        if (!subject)
            res.status(404).send("data is not found");
        else {
            subject.subjectName = req.body.subjectName;
            subject.grades = [...req.body.grades];
            subject.bagrut = req.body.bagrut;
            subject.gmol = req.body.gmol;
            subject.mix = req.body.mix;
            subject.numOfMix = req.body.numOfMix;
            subject.grouping = req.body.grouping;
            subject.subjectFeatures = [...req.body.subjectFeatures];
        }
        subject.save().then(subject => {
            res.json(subject);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

dataRoutes.route('/deleteSubject/:id').post(function (req, res) {
    let id = req.params.id;
    Subject.findByIdAndRemove(id, (err, subject) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(subject);
    })
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
            res.status(200).json({ 'teacher': teacher });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/getTeacher/:id').get(function (req, res) {
    let id = req.params.id;
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
            teacher.currentTeachHours = req.body.currentTeachHours;
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

/* dataRoutes.route('/updateTeacherByName/:teacherName/:hours').post(function (req, res) {
    let hours = req.params.hours;
    let name = req.params.teacherName;
    Teacher.findOne({name: name}, function (err, teacher) {
        if (!teacher)
            res.status(404).send("data is not found");
        else {
            //teacher.name = name;
            //teacher.juniorHighSchool = req.body.juniorHighSchool;
            //teacher.highSchool = req.body.highSchool;
            //teacher.maxTeachHours = req.body.maxTeachHours;
            teacher.currentTeachHours += hours;
            //teacher.dayOff = req.body.dayOff;
            //teacher.grades = [...req.body.grades];
            //teacher.subjectsForTeacher = [...req.body.subjectsForTeacher];
        }
        teacher.save().then(teacher => {
            res.json(teacher);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
}); */

dataRoutes.route('/updateTeacherByName').post(function (req, res) {
    let hours = req.body.hours;
    let name = req.body.name;
    Teacher.findOne({ name: name }, function (err, teacher) {
        if (!teacher)
            // res.status(404).send("data is not found");
            res.send({});
        else {
            teacher.currentTeachHours += hours;
            teacher.save().then(teacher => {
                res.json(teacher);
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        } 
    });
});

dataRoutes.route('/deleteTeacher/:id').post(function (req, res) {
    let id = req.params.id;
    Teacher.findByIdAndRemove(id, (err, teacher) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(teacher);
    })
});

dataRoutes.route('/getConstraints').get(function (req, res) {
    Constraint.find(function (err, constraints) {
        if (err) {
            console.log(err);
        } else {
            res.json(constraints);
        }
    });
});

dataRoutes.route('/addConstraint').post(function (req, res) {
    let constraint = new Constraint(req.body);
    constraint.save()
        .then(teacher => {
            res.status(200).json(constraint);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

/* dataRoutes.route('/getTeacher/:id').get(function (req, res) {
    let id = req.params.id;
    Teacher.findById(id, function (err, teacher) {
        res.json(teacher);
    });
}); */

/* dataRoutes.route('/updateTeacher/:id').post(function (req, res) {
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
}); */

dataRoutes.route('/deleteConstraint/:id').post(function (req, res) {
    let id = req.params.id;
    Constraint.findByIdAndRemove(id, (err, constraint) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(constraint);
    })
});

dataRoutes.route('/dropConstraints').post(function (req, res) {
    connection.dropCollection('constraints', (err, result) => {
        if (err) {
            return res.json(err);
        }
        return res.json(result);
    });
});

dataRoutes.route('/addTimeTable').post(function (req, res) {
    let timeTable = new TimeTable(req.body);
    timeTable.save()
        .then(timeTable => {
            res.status(200).json(timeTable);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

dataRoutes.route('/dropTimeTable').post(function (req, res) {
    connection.dropCollection('timetables', (err, result) => {
        if (err) {
            return res.json(err);
        }
        return res.json(result);
    });
});

dataRoutes.route('/getTimeTable').get(function (req, res) {
    TimeTable.find(function (err, timeTable) {
        if (err) {
            console.log(err);
        } else {
            res.json(timeTable);
        }
    });
});

app.use('/data', dataRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});