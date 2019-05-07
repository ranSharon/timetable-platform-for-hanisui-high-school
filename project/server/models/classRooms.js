const mongoose = require('mongoose');
const { Schema } = mongoose;//this is es6 syntex for "const Schema = mongoose.Schema;"

const classRoomsSchema = new Schema({
    classRoomName: String,
    specificRoom: Boolean,
    computerRoom: Boolean
   
});

module.exports = mongoose.model('ClassRooms', classRoomsSchema);