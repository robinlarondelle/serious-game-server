const routes = require('express').Router();
const departmentController = require("../controllers/department.controller")

routes.get("/:orgID/department", departmentController.getAllDepartmentsFromOrganisation)
routes.get("/:orgID/department/:depID", departmentController.getDepartmentByID)
routes.post("/:orgID/department", departmentController.addDepartment)

module.exports = routes
