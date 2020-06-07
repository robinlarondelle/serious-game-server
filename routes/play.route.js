const routes = require('express').Router();
const PlaysController = require("../controllers/plays.controller")

routes.get("/", PlaysController.getAllPlaysFromDepartment)
routes.get("/:playID", PlaysController.getPlayByIDFromDepartment)
routes.post("/", PlaysController.addPlayToDepartment)
routes.delete("/:playID", PlaysController.deletePlayFromDepartment)

module.exports = routes