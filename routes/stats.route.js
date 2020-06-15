const routes = require('express').Router();
const statController = require("../controllers/stats.controller")

routes.get("/avgScorePerCat", statController.avgScorePerCat)
routes.get("/avgPlayer", statController.avgPlayer)
routes.get("/updateAllPlays", statController.updateAllPlays)

module.exports = routes