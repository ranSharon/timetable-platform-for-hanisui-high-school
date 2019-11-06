const express = require('express');
const router = express.Router();
const TimeTable = require('../models/timeTable');
const mongoose = require('mongoose');
const passport = require("passport");

// router.post('/timeTables', passport.authenticate('jwt', { session: false }), function (req, res) {
router.post('/timeTables', function (req, res) {
    let timeTable = new TimeTable(req.body);
    timeTable.save()
        .then(timeTable => {
            res.status(200).json(timeTable);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

// router.delete('/timeTables', passport.authenticate('jwt', { session: false }), function (req, res) {
router.delete('/timeTables', function (req, res) {
    mongoose.connection.dropCollection('timetables', (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

router.get('/timeTables', function (req, res) {
    TimeTable.find(function (err, timeTable) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(timeTable);
        }
    });
});


module.exports = router;