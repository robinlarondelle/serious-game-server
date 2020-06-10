const mongoose = require("mongoose")
const ApiError = require("../models/apiError.model")
const Play = require("../models/play.model") 
const Game = require("../models/game.model")
const LevelAnswers = require("../models/level.answers.model")
const Category = require("../models/category.model")

module.exports = {
    //Method for starting a new play from a game
    async startNewGame(req, res, next){
        let pin = req.params.playID;
        if (await Game.exists({pin: pin})) {
            const play = new Play({
                _id: new mongoose.Types.ObjectId(),
                pin: pin
            })

            //Saves a new session of the game (=play) and returns the questions of the first level
            play.save().then((session) => {
                getLevel(pin, 1, session._id).then(result => {
                    res.status(200).json(result).end();
                }).catch(error => next(new ApiError("Unkown error", error.message, 500)))
            }).catch(error => next(new ApiError("Unkown error", error.message, 500)))
        } else next(new ApiError("Object not found", "The game with the provided pin '" + pin + "' does not exist.", 404))
    },

    //Method for uploading the answers to a play
    insertAnswers(req, res, next){
        let playID = req.params.playID;
        let answers = req.body.answers;

        let levelAnswers = new LevelAnswers({
            level: req.body.level,
        })

        //Updates the database and returns the correct data to the client
        createLevelAnswers(levelAnswers, answers, playID, (result) => {
            Play.findOneAndUpdate(
                { _id: playID }, 
                { $push: { results: result }
            }).then(() => {
                Play.findById(playID).then((play) => {
                    if (req.body.level == 3) {
                        //Aggregates the results and returns them
                        aggregateData(play, (result) => {
                            let i = 0;
                            play.finished = true
                            for (let [key, value] of Object.entries(result)) {
                                play.scores.push({
                                    category: key,
                                    score: value
                                })
                                i++;
                                if (i == Object.keys(result).length) {
                                    let map = {}
                                    let j = 0
                                    for (let key of Object.keys(result)) {
                                        Category.findById(key).then(cat => {
                                            console.log(cat)
                                            map[cat.name] = result[key]
                                        })
                                        j++;
                                        if (j == Object.keys(result).length) {
                                            play.save().then(() => {
                                                let date = Date.now()
                                                Game.findOneAndUpdate({_id: play.pin}, {$inc : {'totalPlays': 1}, lastPlayed: date}).then(() => {
                                                    res.status(200).json(map).end()
                                                })
                                            })
                                        }
                                    }     
                                }
                            }
                        })
                    } else {
                        //Gets the next level and returns it
                        getLevel(play.pin, req.body.level+1, playID).then(result => {
                            res.status(200).json(result).end();
                        }).catch(error => next(new ApiError("Unkown error", error.message, 500)))
                    }
                })
            })
        })
    }
}

//Makes the game object containing all answers and metadata
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

//Gets the metadata (category and deltaScore) of a single answer
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

//Function for getting the questions from a given level and game pin
function getLevel(pin, level, playID) {
    return new Promise((resolve, reject) => {
        //Finds the game and filters
        Game.findById(pin, {
            '_id': 0, 
            'questions.category': 0, 
            'questions.answers.deltaScore': 0, 
            '__v': 0, 
            'createdAt': 0, 
            'updatedAt': 0, 
            'totalPlays': 0, 
            'description': 0
        })
        .then(result => {
            try {
                let questions = Array();
                for (question of result.questions) {
                    if (question.level == level) {
                        delete question.level
                        questions.push(question)
                    }
                }
                result = result.toObject()
                result['questions'] = questions
                result['playID'] = playID
                result['level'] = level
                resolve(result)
            } catch (error) { reject(error) }
        }).catch(error => reject(error))
    })
}

//Function for aggregating all results from one play
function aggregateData(play, callback) {
    let map = {}
    let i = 0;
    for (level of play.results) {
        aggregateLevel(level, () => {
            i++;
            if (i == play.results.length) {
                callback(map)
            }
        })
    }

    //Function for aggregating all results from one level
    function aggregateLevel(level, callback) {
        let i = 0;
        for (answer of level.questions) {
            let key = answer.category
            let value = answer.deltaScore
            if (key in map) {
                map[key] = map[key] + value
            } else {
                map[key] = value
            }
            i++;
            if (i == level.questions.length) {
                callback()
            }
        }
    }
}