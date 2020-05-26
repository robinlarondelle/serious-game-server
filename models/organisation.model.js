const mongoose = require("mongoose")
const Department = require("./department.model")

const Organisation = mongoose.Schema({
    _id: Number,
    name: {
        type: String,
        required: [true, 'The organisation name is required']
    },
    pin: {
        type: Number,
        required: [true, 'The game needs a PIN code for players to join'],
        min: [100000, "The PIN needs to be a minimum of 10000"],
        max: [999999, "The PIN needs to be a maximum of 99999"],
    },
    departments: [Department.schema]
}, {
    versionKey: false
})

module.exports = mongoose.model("organisation", Organisation)
