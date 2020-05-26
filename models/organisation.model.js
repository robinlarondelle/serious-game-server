const mongoose = require("mongoose")
const Department = require("./department.model")

const Organisation = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    departments: [Department.schema]
})

module.exports = mongoose.model("organisation", Organisation)
