const express = require('express');
const router = express.Router();
const Constraint = require('../models/constraints');
const passport = require("passport");

router.get('/constraints', function (req, res) {
    Constraint.find(function (err, constraints) {
        if (err) {
            console.log(err);
        } else {
            res.json(constraints);
        }
    });
});

router.post('/constraints', passport.authenticate('jwt', { session: false }), function (req, res) {
    let constraint = new Constraint(req.body);
    constraint.save()
        .then(teacher => {
            res.status(200).json(constraint);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.delete('/constraints/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    let id = req.params.id;
    Constraint.findByIdAndRemove(id, (err, constraint) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(constraint);
    })
});

router.delete('/constraints', passport.authenticate('jwt', { session: false }), function (req, res) {
    connection.dropCollection('constraints', (err, result) => {
        if (err) {
            return res.json(err);
        }
        return res.json(result);
    });
});

module.exports = router;