const routes = require('express').Router();
const questionController = require("../controllers/question.controller")

routes.get("/", questionController.getAllQuestionsFromOrganisation)
routes.get("/:queID", questionController.getQuestionFromOrganisationByID)

module.exports = routes