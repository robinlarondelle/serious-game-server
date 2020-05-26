const Test = require("../models/test.model")

module.exports = {
    testServer(req, res, next) {
        Test.create({ test: "First Test" }).then(result => {
            res.status(200).json(result).end()
        })
    }
}