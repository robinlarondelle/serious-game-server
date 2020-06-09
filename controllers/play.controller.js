const mongoose = require("mongoose")
const ApiError = require("../models/apiError.model")
const Play = require("../models/play.model") 
const Game = require("../models/game.model")
const LevelAnswers = require("../models/level.answers.model")

module.exports = {
    //Method for starting a new play from a game
    startNewGame(req, res, next){
        let gamePin = req.params.playID;
        const play = new Play({
            _id: new mongoose.Types.ObjectId(),
            pin: gamePin
        })
        
        //Saves a new session of the game (=play) and returns the questions of the first level
        play.save().then((session) => {
            Game.findById(gamePin, {_id: 0, 'questions.category': 0, 'questions.answers.deltaScore': 0}).select({questions: {$elemMatch: {level: 1}}}).then(result => {
                result = result.toObject()
                result['gameID'] = session._id
                res.status(200).json(result).end()
            })
        }).catch(error => {
            next(new ApiError("Unkown error", error.message, 400));
        })
    },

    insertAnswers(req, res, next){
        let playID = req.params.playID;
        let answers = req.body.answers;

        let levelAnswers = new LevelAnswers({
            level: req.body.level,
        })

        createLevelAnswers(levelAnswers, answers, playID, (result) => {
            Play.findOneAndUpdate(
                { _id: playID }, 
                { $push: { results: result }
            }).then(() => {
                Play.findById(playID).then((play) => {
                    if (req.body.level == 3) {
                        res.status(200).json("Game finished").end();
                    } else {
                        Game.findById(play.pin).select({questions: {$elemMatch: {level: req.body.level+1}}}).then(result => {
                            result = result.toObject()
                            result['gameID'] = playID
                            res.status(200).json(result).end()
                        }).catch(error => {
                            next(new ApiError("Unkown error", error.message, 400));
                        }) 
                    }
                })
            })
        })
    }
}

function createLevelAnswers(levelAnswers, answers, playID, callback) {
    let i = 0;
    for(let answer of answers) {       
        getMetaData(answer.question, answer.answer, playID, (result) => {
            levelAnswers.questions.push({
                question: answer.question,
                answer: answer.answer,
                category: result.category,
                deltaScore: result.deltaScore
            })
            i++;
            if (i == answers.length) {
                callback(levelAnswers)
            }
        })       
    }
}

function getMetaData(question, answer, playID, callback) {
    Play.findById({_id: playID}).then(play => {
        Game.findOne({"pin": play.pin}).select({questions: {$elemMatch: {_id: question}}}).then(result => {
            category = result.questions[0].category
        }).then(() => {
            Game.findOne({"pin": play.pin}).select({questions: {$elemMatch: {_id: question}}}).then(result => {
                for (let a of result.questions[0].answers) {
                    if (a._id == answer) {
                        deltaScore = a.deltaScore
                        callback({ category: category, deltaScore: deltaScore})
                        break;
                    }
                }
            })
        })
    })
}