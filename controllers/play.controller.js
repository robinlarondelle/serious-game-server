const mongoose = require("mongoose")
const ApiError = require("../models/apiError.model")
const Play = require("../models/play.model") 
const LevelAnswers = require("../models/level.answers.model")

module.exports = {
    startNewGame(req, res, next){
        let gamePin = req.params.playID;
        const play = new Play({
            _id: new mongoose.Types.ObjectId(),
            game: gamePin
        })

        console.log(play);
        
        play.save().then(result => {
            console.log("saved results")
            //TODO stuur alle vragen van level 1 op
            res.status(200).json(result).end();
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
            levelAnswers.questions.push({
                question: new mongoose.Types.ObjectId(),
                answer: new mongoose.Types.ObjectId()
                //TODO Add category and deltascore here, also include actual parameters from request body
            })
        }

        Play.findOneAndUpdate({ _id: playID }, {
            $push: { results: levelAnswers }
        }).then(result => {
            // The last level has been played, therefore the game is triggered
            if (level == 3) {
                //TODO genereer heatmap / zeg dat t spel klaar iss
                res.status(200).json(result).end();
            } else {
                //TODO stuur alle vragen van het volgende level op
                res.status(200).json(result).end();
            }
        }).catch(error => {
            next(new ApiError("Unkown error", error.message, 400));
        })
    }
}