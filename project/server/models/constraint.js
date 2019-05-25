const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const constraintSchema = new Schema({
    teacher: String,
    subject: String,
    grade: String,
    hours: String,
    classNumber: Array,
    lessonSplit: Boolean, // השיעור מפוצל למספר שעות
    numOfSplits: Number, // מספר פיצולי שיעור לשעות
    firstLesson: Number,
    secondlesson: Number,
    thirdlesson: Number,
    subjectGrouping: Boolean, //מחלוק להקבצות
    subjectMix: Boolean, // מקצוע מערבב לאו דווקא מחלוק להקבצות
    subjectFeatures: Array,
    subjectNumOfMix: Number, // מספר ההקבצות אליהם מחלוק המקצוע
    groupingTeachers: Array,
    constraintSplitsBros: Array,
    constraintCopyBros: Array,
    copyConstraint: Boolean,
    num: Number,
    mainConstraint: Boolean
});

module.exports = mongoose.model('Constraints', constraintSchema);