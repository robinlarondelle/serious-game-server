const routes = require('express').Router();
const departmentController = require("../controllers/department.controller")
const departmentMiddleware = require("../middlewares/department.middleware")

routes.get("/", departmentController.getAllDepartmentsFromOrganisation)
routes.get("/:depID", departmentMiddleware.findDepartmentByID, departmentController.getDepartmentByID)
routes.post("/", departmentController.addDepartment)
routes.put("/:depID", departmentMiddleware.findDepartmentByID, departmentController.updateDepartmentByID)
routes.delete("/:depID", departmentMiddleware.findDepartmentByID, departmentController.deleteDepartmentByID)

module.exports = routes
