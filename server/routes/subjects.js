const express = require('express');
const router = express.Router();
const Subject = require('../models/subjects');
const passport = require("passport");

router.get('/subjects', function (req, res) {
    Subject.find(function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

router.post('/subjects', passport.authenticate('jwt', { session: false }), function (req, res) {
    let subject = new Subject(req.body);
    subject.save()
        .then(subject => {
            res.status(200).json(subject);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.get('/subjects/:id', function (req, res) {
    let id = req.params.id;
    Subject.findById(id, function (err, subject) {
        res.json(subject);
    });
});

router.put('/subjects/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
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

router.delete('/subjects/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    let id = req.params.id;
    Subject.findByIdAndRemove(id, (err, subject) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(subject);
    })
});

module.exports = router;