const mongoose = require("mongoose")
const Department = require("./department.model")
const Question = require("./question.model")

const Organisation = mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String,
        required: [true, 'The organisation name is required'],
        unique: [true, 'There already exists an Organisation with this name'],
        index: true
    },
    pin: {
        type: Number,
        required: [true, 'The game needs a PIN code for players to join'],
        min: [100000, "The PIN needs to be a minimum of 10000"],
        max: [999999, "The PIN needs to be a maximum of 99999"],
    },
    departments: [Department.schema],
    questions: [Question.schema]
}, {
    versionKey: false
})

Organisation.virtual('orgID').get(function() { return this._id; });

module.exports = mongoose.model("organisation", Organisation)
