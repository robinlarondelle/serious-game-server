const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PlayResult = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    //answerStats is a key-value pair of stats that belong to an answer
    answerStats: [{
        type: Map,
        of: Number
    }]
}, {_id: false})

// A Play contains all the data of one complete playing session of a player
// It contains the answers of a question
const Play = new Schema({
    date: { 
        type: Date, 
        default: Date.now
    },
    results: [PlayResult]
})

module.exports = mongoose.model("play", Play)