const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const daySchema = new Schema({
    day: String,
    startTime: String,
    endTime: String
});

module.exports = mongoose.model('Days', daySchema);