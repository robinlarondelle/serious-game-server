const routes = require('express').Router();
const statController = require("../controllers/stats.controller")

routes.get("/avgScorePerCat", statController.avgScorePerCat)
routes.get("/avgPlayer", statController.avgPlayer)
routes.get("/:gameID/playsPerDay", statController.playsPerDay)
routes.get("/:pin/topPlay", statController.getTopPlay)
routes.get("/:pin/minPlay", statController.getMinPlay)
routes.get("/percentageQuestions", statController.getPercentageQuestions)

module.exports = routes