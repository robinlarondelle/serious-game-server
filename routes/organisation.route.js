const routes = require('express').Router();
const organisationController = require("../controllers/organisation.controller")

routes.get("/", organisationController.getAllOrganisations)
routes.post("/", organisationController.addOrganisation)

module.exports = routes
