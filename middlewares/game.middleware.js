const ApiError = require("../models/apiError.model")
const Game = require("../models/game.model")

module.exports = {
    findGameByID(req, res, next) {
        const { gameID } = req.params
        Game.findById(gameID).then(game => {
            console.log(game);
            
            if (game) {
                req.game = game
                next()
            }
            else next(new ApiError("NotFound", `Game with ID ${gameID} not found.`, 404))
        }).catch(err => next(new ApiError("ServerError", err, 400)))
    }
}