const express = require('express');
const router = express.Router();
const ClassRoom = require('../models/classRooms');

router.get('/classRooms',function (req, res) {
    ClassRoom.find(function (err, classRoom) {
        if (err) {
            console.log(err);
        } else {
            res.json(classRoom);
        }
    });
});

router.post('/classRooms',function (req, res) {
    let classRoom = new ClassRoom(req.body);
    classRoom.save()
        .then(classRoom => {
            res.status(200).json(classRoom);
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

router.get('/classRooms/:id',function (req, res) {
    let id = req.params.id;
    ClassRoom.findById(id, function (err, classRoom) {
        res.json(classRoom);
    });
});

router.put('/classRooms/:id',function (req, res) {
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

router.delete('/classRooms/:id',function (req, res) {
    let id = req.params.id;
    ClassRoom.findByIdAndRemove(id, (err, classRoom) => {
        if (err) {
            return res.json({ 'message': 'Some Error' });
        }
        return res.json(classRoom);
    })
});

module.exports = router;