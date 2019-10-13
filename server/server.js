// ran
// JxzyMt12gkITSNcf
// mongodb+srv://ran:<password>@cluster0-hdnsl.mongodb.net/test?retryWrites=true

const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require("passport");
const PORT = process.env.PORT || 4000;
const usersRouter = require('./routes/users');
const daysRouter = require('./routes/days');
const gradesRouter = require('./routes/grades');
const classRoomsRouter = require('./routes/classRooms');
const roomFeaturesRouter = require('./routes/roomFeatures');
const subjectsRouter = require('./routes/subjects');
const teachersRouter = require('./routes/teachers');
const constraintsRouter = require('./routes/constraints');
const timeTablesRouter = require('./routes/timeTables');

// database
mongoose.connect('mongodb+srv://ran:JxzyMt12gkITSNcf@cluster0-hdnsl.mongodb.net/test?retryWrites=true', { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect(keys.mongoURI, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
});

// middlewares 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(express.static(__dirname)); // static files
app.use(express.static(path.join(__dirname, '../build'))); // static files

// API routes
app.use('/api', usersRouter);
app.use('/api', daysRouter);
app.use('/api', gradesRouter);
app.use('/api', classRoomsRouter);
app.use('/api', roomFeaturesRouter);
app.use('/api', subjectsRouter);
app.use('/api', teachersRouter);
app.use('/api', constraintsRouter);
app.use('/api', timeTablesRouter);

// unhandle path
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});