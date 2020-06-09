const mongoose = require("mongoose")
const Schema = mongoose.Schema
const LevelAnswers = require("./level.answers.model")

const Play = new Schema({
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    pin: {
        type: Number,
        required: true
    },
    results: [{
        type: LevelAnswers.schema,
        required: false
    }],
    scores: [{
        category: {
            type: mongoose.ObjectId,
            required: false
        },
        score: {
            type: Number,
            required: false
        },
        required: false
    }]
}, { versionKey: false })

module.exports = mongoose.model("play", Play)