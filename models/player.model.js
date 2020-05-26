const mongoose = require("mongoose")

const Player = mongoose.Schema({
    score: Number
})

module.exports = mongoose.model("player", Player)