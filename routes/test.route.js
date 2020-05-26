const routes = require('express').Router();
const testController = require("../controllers/test.controller")

routes.get("/", testController.testServer)

module.exports = routes
