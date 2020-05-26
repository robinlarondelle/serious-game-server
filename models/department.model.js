const mongoose = require("mongoose")
const Player = require("./player.model")

const Department = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'The department name is required']
    },
    players: [Player.schema]
}, {
    versionKey: false
})

module.exports = mongoose.model("department", Department)