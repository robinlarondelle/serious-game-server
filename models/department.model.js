const mongoose = require("mongoose")
const Player = require("./player.model")

const Department = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    players: [Player.schema]
})

module.exports = mongoose.model("department", Department)