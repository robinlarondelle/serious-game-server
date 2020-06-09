const ApiError = require("../models/apiError.model")
const Game = require("../models/game.model")
const Question = require("../models/question.model")

module.exports = {
    getAllGames(req, res, next) {
        Game.find({}).then(games => {
            res.status(200).json(games).end()
        })
    },

    getGameByID(req, res, next) {
        res.status(200).json(req.game).end()
    },

    addGame(req, res, next) {
        let { pin, questions, description } = req.body
        if (pin == null) pin = Math.floor(Math.random() * 900000) + 100000 //create PIN if not supplied  

        if (questions instanceof Array && questions.length == 3) {
            const newGame = new Game({ _id: pin, description: description, pin: pin, questions: questions })

            newGame.save().then(savedGame => {
                res.status(201).json(savedGame).end()
            }).catch(err => next(new ApiError("ServerError", err, 400)))
        } else next(new ApiError("BodyError", "Please provide at least 3 questions", 400))
    },

    updateGameByID(req, res, next) {
        const { questions, description } = req.body
        const { gameID } = req.params
        Game.findOneAndUpdate(
            { _id: gameID },
            { description: description, questions: questions },
            { new: true })
            .then(updatedDoc => {
                res.status(200).json(updatedDoc).end()
            })
            .catch(err => next(new ApiError("ServerError", err, 400)))
    },

    deleteGameByID(req, res, next) {
        Game.findOneAndDelete(req.params.gameID)
            .then(() => res.status(200).json({ "message": "success" }).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    }
}