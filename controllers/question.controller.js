const Organisation = require("../models/organisation.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllQuestionsFromOrganisation(req, res, next) {
        console.log(req.params);
        
        const {orgID} = req.params  

        Organisation.findById("fe23f2r").then(org => {
            if (org !== null) {
                res.status(200).json(org.questions).end()
            } else next(new ApiError("NotFound", `Organisation with ID '${orgID}' not found`, 404))
        }).catch(err => next(new ApiError("ServerError", err, 400)))
    }
}