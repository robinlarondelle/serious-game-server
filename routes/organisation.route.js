const routes = require('express').Router();
const organisationController = require("../controllers/organisation.controller")

routes.get("/", organisationController.getAllOrganisations)

module.exports = routes
