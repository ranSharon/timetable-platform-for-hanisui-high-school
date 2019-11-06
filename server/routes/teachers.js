const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');
const passport = require("passport");

router.get('/teachers', function (req, res) {
    Teacher.find(function (err, todos) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(todos);
        }
    });
});

// router.post('/teachers', passport.authenticate('jwt', { session: false }), function (req, res) {
router.post('/teachers', function (req, res) {
    let teacher = new Teacher(req.body);
    teacher.save()
        .then(teacher => {
            res.status(200).json({ 'teacher': teacher });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.get('/teachers/:id', function (req, res) {
    let id = req.params.id;
    Teacher.findById(id, function (err, teacher) {
        if (err) {
            res.send(err);
        } else {
            res.json(teacher);
        }
    });
});

// router.put('/teachers/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
router.put('/teachers/:id', function (req, res) {
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

// router.put('/teachers/', passport.authenticate('jwt', { session: false }), function (req, res) {
router.put('/teachers/', function (req, res) {
    let hours = req.body.hours;
    let name = req.body.name;
    Teacher.findOne({ name: name }, function (err, teacher) {
        if (!teacher)
            res.status(404).send("data is not found");
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

// router.delete('/teachers/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
router.delete('/teachers/:id', function (req, res) {
    let id = req.params.id;
    Teacher.findByIdAndRemove(id, (err, teacher) => {
        if (err) {
            res.json({ 'message': 'Some Error' });
        } else {
            res.json(teacher);
        }
    })
});

module.exports = router;