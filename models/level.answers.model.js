const mongoose = require("mongoose")
const Schema = mongoose.Schema

const LevelAnswers = new Schema({
    level: {
        type: Number,
        required: true
    }, 
    questions: [{
        question: {
            type: mongoose.ObjectId,
            required: true
        }, 
        answer: {
            type: mongoose.ObjectId,
            required: true
        },
        category: {
            type: mongoose.ObjectId,
            required: false
        },
        deltaScore: {
            type: Number,
            required: false
        }
    }]
}, { versionKey: false, _id: false })

module.exports = mongoose.model("levelAnswers", LevelAnswers)