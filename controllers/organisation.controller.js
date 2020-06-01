const Organisation = require("../models/organisation.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllOrganisations(req, res, next) {
        Organisation.find({}).then(organisations => {
            res.status(200).json(organisations).end()
        })
    },

    getOrganisationByID(req, res, next) {
        const {orgID} = req.params 

        Organisation.findById(orgID).then(org => {
            if (org !== null) {
                res.status(200).json(org).end()
            } else next(new ApiError("NotFound", `Organisation with ID '${orgID}' not found`, 404))
        })
    },

    addOrganisation(req, res, next) {
        let { name, pin } = req.body
        if (!pin) pin = Math.floor(Math.random() * 900000) + 100000 //create PIN if not supplied

        const organisation = new Organisation({ _id: pin, name, pin })
        organisation.save()
            .then(createdOrganisation => {
                res.status(201).json(createdOrganisation).end()
            })
            .catch(err => {
                //Error code 11000 is the MongoDB "DuplicateEntry" error
                if (err.code == "11000") next(new ApiError("DuplicateEntry", `The name '${name}' already exists`, 400))
                else next(new ApiError(err, 400))
            })
    }
}