const routes = require('express').Router();
const questionController = require("../controllers/question.controller")

routes.get("/", questionController.getAllQuestionsFromOrganisation)
routes.get("/:queID", questionController.getQuestionFromOrganisationByID)
routes.post('/', questionController.addQuestionToOrganisation)
routes.put('/:queID', questionController.updateQuestionFromOrganisation)

module.exports = routes