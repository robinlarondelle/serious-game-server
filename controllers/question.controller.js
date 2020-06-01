const Organisation = require("../models/organisation.model")
const Question = require("../models/question.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllQuestionsFromOrganisation(req, res, next) {
        const { organisation } = req
        res.status(200).json(organisation.questions).end()
    },

    getQuestionFromOrganisationByID(req, res, next) {
        const { organisation } = req
        const { queID } = req.params
        const question = organisation.questions.find(q => q._id == queID)

        if (question) res.status(200).json(question).end()
        else next(new ApiError('NotFound', `No Question with ID '${queID}' found in Organisation '${organisation.name}'`, 404))
    },

    addQuestionToOrganisation(req, res, next) {
        const { organisation } = req
        const { question, correctAnswer, possibleAnswers } = req.body
        const questionDoc = new Question({
            question,
            correctAnswer,
            possibleAnswers
        })

        questionDoc.validate(err => {
            if (!err) {
                organisation.questions.push(questionDoc)
                organisation.save().then(savedDoc => {
                    res.status(201).json(savedDoc).end()
                }).catch(err => next(new ApiError('ServerError', err, 400)))
            } else next(new ApiError("ValidationError", err, 400))
        })
    },

    updateQuestionFromOrganisation(req, res, next) {
        const { queID } = req.params
        const { organisation } = req
        const { question, correctAnswer, possibleAnswers } = req.body
        const questionIndex = organisation.questions.findIndex(q => q._id == queID)
        console.log(questionIndex);
        
        const updatedQuestion = new Question({ question, correctAnswer, possibleAnswers })

        updatedQuestion.validate(err => {
            if (!err) {
                if (questionIndex != null) {
                    organisation.questions.splice(questionIndex, 1)
                    organisation.questions.push(updatedQuestion)
                    organisation.save()
                        .then(updatedDoc => res.status(200).json(updatedDoc).end())
                        .catch(err => next(new ApiError("ServerError", err, 400)))
                } else next(new ApiError('NotFound', `No Question with ID '${queID} found in Organisation '${organisation.name}'`, 404))
            } else next(new ApiError("ValidationError", err, 400))
        })
    },

    deleteQuestionFromOrganisationByID(req, res, next) {
        const { organisation } = req
        const { queID } = req.params

        const questionIndex = organisation.questions.findIndex(q => q._id == queID)
        console.log(questionIndex);
        
        if (questionIndex != null) {
            organisation.questions.splice(questionIndex, 1)
            organisation.save()
                .then(updatedDoc => res.status(200).json(updatedDoc).end())
                .catch(err => next(new ApiError("ServerError", err, 400)))
        } else next(new ApiError('NotFound', `No Question with ID '${queID} found in Organisation '${organisation.name}'`, 404))
    }
}