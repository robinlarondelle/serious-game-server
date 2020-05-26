const Organisation = require("../models/organisation.model")

module.exports = {
    getAllOrganisations(req, res, next) {
        Organisation.find({}).then(organisations => {
            res.status(200).json(organisations).end()
        })
    }
}