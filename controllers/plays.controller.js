const ApiError = require("../models/apiError.model")
const Play = require("../models/play.model")

module.exports = {
    getAllPlaysFromDepartment(req, res, next) {
        const { department } = req
        res.status(200).json(department.plays).end()
    },

    getPlayByIDFromDepartment(req, res, next) {
        const { department } = req
        const { playID } = req.params
        const play = department.plays.find(p => p._id == playID)

        if (play) res.status(200).json(play).end()
        else next(new ApiError("NotFound", `The play with ID ${playID} was not found`, 404))
    },

    addPlayToDepartment(req, res, next) {
        const { organisation, department } = req
        const results = req.body.results

        if (results) {
            const correctProps = results.find(r => 'question' in r && 'answer' in r && 'answerStats' in r)

            if (correctProps) {
                const newPlay = new Play({ results })

                newPlay.validate(err => {
                    if (!err) {
                        department.plays.push(newPlay)
                        organisation.save()
                            .then(() => res.status(201).json(department).end())
                            .catch(err => next(new ApiError("ServerError", err, 400)))
                    } else next(new ApiError("ValidationError", err, 400))
                })
            } else next(new ApiError("ServerError", "Please supply an array of results", 401))
        } else next(new ApiError("ServerError", "Please supply an array of results", 401))
    },

    deletePlayFromDepartment(req, res, next) {
        const { organisation, department } = req
        const { playID } = req.params
        const newPlaysArray = department.plays.filter(p => p._id != playID)

        department.plays = newPlaysArray
        organisation.save()
            .then(() => res.status(200).json(department).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    }
}