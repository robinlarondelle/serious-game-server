const routes = require('express').Router();
const statController = require("../controllers/stats.controller")

routes.get("/avgScorePerCat", statController.avgScorePerCat)
routes.get("/avgPlayer", statController.avgPlayer)

module.exports = routes