const mongoose = require("mongoose")
const ApiError = require("../models/apiError.model")
const Play = require("../models/play.model") 
const Game = require("../models/game.model")
const LevelAnswers = require("../models/level.answers.model")

module.exports = {
    startNewGame(req, res, next){
        let gamePin = req.params.playID;
        const play = new Play({
            _id: new mongoose.Types.ObjectId(),
            game: gamePin
        })
        
        //Saves a new session of the game (=play) and returns the questions of the first level
        play.save().then(() => {
            console.log("saved results")
            Game.find({ level: 1 }).then(result => {
                res.status(200).json(result).end();
            }).catch(error => res.status(500).json(error).end())
        }).catch(error => {
            next(new ApiError("Unkown error", error.message, 400));
        })
    },

    insertAnswers(req, res, next){
        let playID = req.params.playID;
        let level = req.body.level;
        let answers = req.body.answers;

        const levelAnswers = new LevelAnswers({
            level: level,
        })

        for(let answer of answers) {
            //Get related category and deltascore
            let categoryId;
            let deltaScore;
            Play.findById(playID).then(result => {
                Game.findOne({ pin: result.pin }).then(result => {
                    result.questions.findOne({_id : answer.question}).then(question => {
                        categoryId = question.category
                        question.answers.findById(answer.answer).then(ans => {
                            deltaScore = ans.deltascore
                        }).catch(error => res.status(500).json(error).end())
                    }).catch(error => res.status(500).json(error).end())
                }).catch(error => res.status(500).json(error).end())
            }).catch(error => res.status(500).json(error).end())

            //Push the answers to the new LevelAnswers object
            levelAnswers.questions.push({
                question: answer.question,
                answer: answer.answer,
                category: categoryId,
                deltaScore: deltaScore
            })
        }

        //Push the LevelAnswers object into the array and commit it
        Play.findOneAndUpdate(
            { _id: playID }, 
            { $push: { results: levelAnswers }
        }).then(() => {
            if (level == 3) {
                let dictionary = {}
                //Aggregate all deltaScores
                Play.findById({ _id : playID }).then(result => {
                    for (levelAnswers of result.results) {
                        for (answer of levelAnswers.questions) {
                            let key = answer.category
                            let value = answer.deltaScore
                            if (key in dictionary) {
                                dictionary[key] = dictionary[key] + value
                            } else {
                                dictionary[key] = value
                            }
                        }
                    }
                })

                //Put all scores in the play session
                for (category of dictionary) {
                    Play.findOneAndUpdate({ _id: playId}, {
                        $push: { score: {
                                category: category,
                                score: dictionary[category]
                            } 
                        }
                    })
                }

                //Set the finished state to true and return it for analysis
                Play.findOneAndUpdate({ _id: playId}, 
                    { finished : true }).then(result => {
                        res.status(200).json(result).end();
                })
            } else {
                Game.find({ level: level+1 }).then(result => {
                    res.status(200).json(result).end();
                }).catch(error => res.status(500).json(error).end())
            }
        }).catch(error => {
            next(new ApiError("Unkown error", error.message, 500));
        })
    }
}