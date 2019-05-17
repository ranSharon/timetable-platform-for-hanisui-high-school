const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const classRoomsSchema = new Schema({
    classRoomName: String,
    classRoomFeatures: Array
});

module.exports = mongoose.model('ClassRooms', classRoomsSchema);