const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Question = new Schema({
    question: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    possibleAnswers: [{
        type: String
    }]
})

Question.pre('save', function(next) {
    const answer = this.possibleAnswers.find(a => a == this.correctAnswer)
    if (!answer) next("The correct answer must be a possible answer")
    else next()
})

module.exports = mongoose.model("questions", Question)