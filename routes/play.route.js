const routes = require('express').Router();
const PlaysController = require("../controllers/play.controller")

routes.post("/:playID", PlaysController.startNewGame)
routes.put("/:playID", PlaysController.insertAnswers)

module.exports = routes