const routes = require('express').Router();
const organisationController = require("../controllers/organisation.controller")

routes.get("/", organisationController.getAllOrganisations)
routes.get("/:orgID", organisationController.getOrganisationByID)
routes.post("/", organisationController.addOrganisation)

module.exports = routes
