const express = require('express');
const router = express.Router();
const Constraint = require('../models/constraint');
const passport = require("passport");

router.get('/constraints', function (req, res) {
    Constraint.find(function (err, constraints) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(constraints);
        }
    });
});

router.post('/constraints', passport.authenticate('jwt', { session: false }), function (req, res) {
    let constraint = new Constraint(req.body);
    constraint.save()
        .then(constraint => {
            res.status(200).json(constraint);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

router.delete('/constraints/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    let id = req.params.id;
    Constraint.findByIdAndRemove(id, (err, constraint) => {
        if (err) {
            res.json({ 'message': 'Some Error' });
        } else {
            res.json(constraint);
        }
    })
});

router.delete('/constraints', passport.authenticate('jwt', { session: false }), function (req, res) {
    connection.dropCollection('constraints', (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;