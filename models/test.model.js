const mongoose = require("mongoose")

const test = mongoose.Schema({
    test: String
})

module.exports = mongoose.model("Tests", test)