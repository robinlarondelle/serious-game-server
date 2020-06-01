const routes = require('express').Router();
const questionController = require("../controllers/question.controller")

routes.get("/", questionController.getAllQuestionsFromOrganisation)

module.exports = routes