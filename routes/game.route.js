const routes = require('express').Router();
const gameController = require("../controllers/game.controller")
const gameMiddleware = require("../middlewares/game.middleware")

routes.get("/", gameController.getAllGames)
routes.get("/gamepin", gameController.getAllGamePINs)
routes.get("/playsPerGame", gameController.getPlaysPerGame)
routes.get("/:gameID", gameMiddleware.findGameByID, gameController.getGameByID)
routes.post("/", gameController.addGame)
routes.put("/:gameID", gameMiddleware.findGameByID, gameController.updateGameByID)
routes.delete("/:gameID", gameMiddleware.findGameByID, gameController.deleteGameByID)

module.exports = routes