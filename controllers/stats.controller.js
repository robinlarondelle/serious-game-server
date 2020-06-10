const Category = require("../models/category.model")
const Game = require("../models/game.model")

module.exports = {
    avgScorePerCat(req, res, next) {
        Game.find({}).then(games => {
            
        })
    }
}