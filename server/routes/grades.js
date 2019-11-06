const express = require('express');
const router = express.Router();
const Grade = require('../models/grade');
const passport = require("passport");

router.get('/grades', function (req, res) {
    Grade.find(function (err, grades) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(grades);
        }
    });
});

// router.post('/grades', passport.authenticate('jwt', { session: false }), function (req, res) {
router.post('/grades', function (req, res) {
    let grade = new Grade(req.body);
    grade.save()
        .then(grade => {
            res.status(200).json(grade);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.get('/grades/:id', function (req, res) {
    let id = req.params.id;
    Grade.findById(id, function (err, grade) {
        if (err) {
            res.send(err);
        } else {
            res.json(grade);
        }
    });
});

// router.put('/grades/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
router.put('/grades/:id', function (req, res) {
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

// router.delete('/grades/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
router.delete('/grades/:id', function (req, res) {
    let id = req.params.id;
    Grade.findByIdAndRemove(id, (err, grade) => {
        if (err) {
            res.json({ 'message': 'Some Error' });
        } else {
            res.json(grade);
        }
    })
});

module.exports = router;