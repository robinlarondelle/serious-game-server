const Organisation = require("../models/organisation.model")
const ApiError = require("../models/apiError.model")
module.exports = {
    findOrganisationByID(req, res, next, orgID) {
        Organisation.findById(orgID).then(org => {
            if (org !== null) {
                req.organisation = org
                next()
            } else next(new ApiError("NotFound", `Organisation with ID '${orgID}' not found`, 404))
        })
    }
}