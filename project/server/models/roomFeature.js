const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const roomFeaturesSchema = new Schema({
    roomFeature: String
});

module.exports = mongoose.model('RoomFeatures', roomFeaturesSchema);