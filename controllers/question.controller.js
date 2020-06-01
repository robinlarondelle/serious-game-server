const Organisation = require("../models/organisation.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllQuestionsFromOrganisation(req, res, next) {
        const { organisation } = req
        res.status(200).json(organisation.questions).end()
    },

    getQuestionFromOrganisationByID(req, res, next) {
        const {organisation } = req
        const {queID} = req.params
        const question = organisation.questions.find(q => q._id == queID)

        if (question) res.status(200).json(question).end()
        else next(new ApiError('NotFound', `No Question with ID '${queID}' found in Organisation '${organisation._id}'`, 404))
    }
}