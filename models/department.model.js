const mongoose = require("mongoose")
const Play = require("../models/play.model")

const Department = mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Min 3 chars required for the Department name'], 
        maxlength: [30, 'Max 30 chars allowed for the Department name'],
        required: [true, 'The department name is required']
    },
    plays: [Play.schema]
}, {
    versionKey: false
})

module.exports = mongoose.model("department", Department)