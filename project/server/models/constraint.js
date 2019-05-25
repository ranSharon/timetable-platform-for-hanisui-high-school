const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const constraintSchema = new Schema({
    teacher: String,
    subject: String,
    grade: String,
    hours: String,
    classNumber: Array,
    lessonSplit: Boolean, // השיעור מפוצל למספר שעות
    numOfSplits: Number,
    firstLesson: Number,
    secondlesson: Number,
    thirdlesson: Number,
    subjectGrouping: Boolean, //מחלוק להקבצות
    subjectMix: Boolean,
    subjectFeatures: Array,
    subjectNumOfMix: Number,
    constraintSplitsBros: Array,
    constraintCopyBros: Array,
    copyConstraint: Boolean,
    num: Number
});

module.exports = mongoose.model('Constraints', constraintSchema);