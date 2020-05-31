const mongoose = require("mongoose")
const Player = require("./player.model")

const Department = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        alias: 'depID'
    },
    name: {
        type: String,
        minlength: [3, 'Min 3 chars required for the Department name'], 
        maxlength: [30, 'Max 30 chars allowed for the Department name'],
        required: [true, 'The department name is required']
    },
    players: [Player.schema]
}, {
    versionKey: false
})

module.exports = mongoose.model("department", Department)