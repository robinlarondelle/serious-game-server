const mongoose = require("mongoose")
const Question = require("../models/question.model")
const Play = require("../models/play.model")

const Game = mongoose.Schema({
    _id: {
        type: Number
    },
    description: {
        type: String,
        required: true
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
    },
    totalPlays: {
        type: Number,
        required: true,
        default: 0
    }, lastPlayed: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
})
module.exports = mongoose.model("game", Game)