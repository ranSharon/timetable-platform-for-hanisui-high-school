const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require('../config/dev');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const User = require("../models/user");
const passport = require("passport");

router.get('/users', function (req, res) {
    User.find(function (err, users) {
        if (err) {
            res.send(err);
        } else {
            res.send(users);
        }
    });
})

router.delete('/users/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
    const id = req.params.id;
    User.findByIdAndRemove(id, (err, user) => {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    })
})

router.post("/users/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        // return res.status(400).json(errors);
        res.status(400).json(errors);
    }
    User.findOne({ name: req.body.name }).then(user => {
        if (user) {
            // return res.status(400).json({ name: "Name already exists" });
            res.status(400).json({ name: "Name already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => res.send(err));
                });
            });
        }
    });
});

router.post("/users/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const name = req.body.name;
    const password = req.body.password;
    // Find user by name
    User.findOne({ name }).then(user => {
        // Check if user exists
        if (!user) {
            // return res.status(404).json({ namenotfound: "Name not found" });
            return res.status(404).json({ namenotfound: "Name not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user._id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    // {
                    //     expiresIn: 31556926 // 1 year in seconds
                    // },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                // return res.status(400).json({
                res.status(400).json({
                    passwordincorrect: "Password incorrect"
                });
            }
        });
    });
});


module.exports = router;