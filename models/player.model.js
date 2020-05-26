const mongoose = require("mongoose")

const Player = mongoose.Schema({
    score: Number
}, {
    versionKey: false
})

module.exports = mongoose.model("player", Player)