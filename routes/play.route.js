const routes = require('express').Router();
const playsController = require("../controllers/play.controller")

routes.get("/", playsController.getAllPlays)
routes.get("/playsPerDay", playsController.getPlaysPerDay)
routes.post("/:playID", playsController.startNewGame)
routes.put("/:playID", playsController.insertAnswers)

module.exports = routes