const express = require('express');
const router = express.Router();
const RoomFeature = require('../models/roomFeature');
const passport = require("passport");

router.get('/roomFeatures', function (req, res) {
    RoomFeature.find(function (err, roomFeature) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(roomFeature);
        }
    });
});

router.post('/roomFeatures', passport.authenticate('jwt', { session: false }), function (req, res) {
    let roomFeature = new RoomFeature(req.body);
    roomFeature.save()
        .then(roomFeature => {
            res.status(200).json(roomFeature);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.delete('/roomFeatures/:name', passport.authenticate('jwt', { session: false }), function (req, res) {
    let name = req.params.name;
    RoomFeature.findOneAndDelete({ roomFeature: name }, (err, roomFeature) => {
        if (err) {
            res.json({ 'message': 'Some Error' });
        } else {
            res.json(roomFeature);
        }
    })
});

module.exports = router;