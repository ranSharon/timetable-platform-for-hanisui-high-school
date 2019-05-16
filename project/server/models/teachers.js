const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const teacherSchema = new Schema({
    name: String,
    juniorHighSchool: Boolean,
    highSchool: Boolean,
    maxTeachHours: String,
    dayOff: String,
    grades: Array,
    subjectsForTeacher: Array
});

module.exports = mongoose.model('Teachers', teacherSchema);