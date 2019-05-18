const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const subjectSchema = new Schema({
    subjectName: String,
    grades: Array,
    bagrut: Boolean,
    gmol: String,
    mix: Boolean,
    numOfMix: String,
    grouping: Boolean,
    subjectFeatures: Array
});

module.exports = mongoose.model('Subjects', subjectSchema);