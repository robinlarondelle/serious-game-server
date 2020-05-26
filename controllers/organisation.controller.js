const Organisation = require("../models/organisation.model")
const ApiError = require("../models/apiError.model")
module.exports = {
    getAllOrganisations(req, res, next) {
        Organisation.find({}).then(organisations => {
            res.status(200).json(organisations).end()
        })
    },

    addOrganisation(req, res, next) {
        let { name, pin } = req.body
        if (!pin) pin = Math.floor(Math.random() * 900000) + 100000 //create PIN if not supplied

        Organisation({ _id: pin, name, pin }).save()
            .then(createdOrganisation => {
                res.status(201).json(createdOrganisation).end()
            })
            .catch(err => next(new ApiError(err, 400)))
    }
}