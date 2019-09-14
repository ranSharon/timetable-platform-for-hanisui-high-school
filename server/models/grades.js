const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const gradeSchema = new Schema({
    grade: String,
    numOfClasses: String
});

module.exports = mongoose.model('Grades', gradeSchema);