const express = require('express');
const router = express.Router();
const Day = require('../models/days');

router.get('/days', function (req, res) {
    Day.find(function (err, days) {
        if (err) {
            console.log(err);
        } else {
            res.json(days);
        }
    });
});

router.post('/days', function (req, res) {
    let day = new Day(req.body);
    day.save()
        .then(day => {
            res.status(200).json(day);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.get('/days/:id', function (req, res) {
    let id = req.params.id;
    Day.findById(id, function (err, day) {
        res.json(day);
    });
});

router.put('/days/:id', function (req, res) {
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

router.delete('/days/:id', function (req, res) {
    let id = req.params.id;
    Day.findByIdAndRemove(id, (err, day) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(day);
    })
});

module.exports = router;