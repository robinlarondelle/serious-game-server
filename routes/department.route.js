const routes = require('express').Router();
const departmentController = require("../controllers/department.controller")

routes.get("/", departmentController.getAllDepartmentsFromOrganisation)
routes.get("/:depID", departmentController.getDepartmentByID)
routes.post("/", departmentController.addDepartment)
routes.put("/:depID", departmentController.updateDepartmentByID)
routes.delete("/:depID", departmentController.deleteDepartmentByID)

module.exports = routes
