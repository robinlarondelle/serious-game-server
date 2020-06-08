const mongoose = require("mongoose")
const Question = require("../models/question.model")

const Game = mongoose.Schema({
    _id: {
        type: Number
    },
    pin: {
        type: Number,
        required: [true, 'The game needs a PIN code for players to join'],
        min: [100000, "The PIN needs to be a minimum of 10000"],
        max: [999999, "The PIN needs to be a maximum of 99999"],
    },
    questions: {
        type: [Question.schema],
        required: false
    }
}, {versionKey: false})

module.exports = mongoose.model("game", Game)