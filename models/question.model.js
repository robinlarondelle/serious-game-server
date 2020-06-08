const mongoose = require("mongoose")
const Schema = mongoose.Schema

// The Question model represents a question that belong to a certain level (ranging from 1 to 10)
// A question has a certain 'category' which it represents (like Integrity or Thrustworthy)
// Each question has exactly 4 answers. Each answer can mutate the category score.
const Question = new Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [{
            answer: {
                type: String,
                required: true
            },
            deltaScore: {
                type: Number,
                required: true
            }
        }],
        validate: {
            validator: function(arr) {
                return arr.length == 4
            },
            message: "You need to provide exactly 4 answers"
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    level: {
        type: Number,
        min: 1,
        max: 10
    }
})

module.exports = mongoose.model("questions", Question)