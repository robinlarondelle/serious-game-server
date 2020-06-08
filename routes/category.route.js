const routes = require('express').Router();
const categoryController = require("../controllers/category.controller")

routes.get("/", categoryController.getAllCategories)
routes.post("/", categoryController.addCategory)
routes.put("/:catID", categoryController.updateCategory)
routes.delete("/:catID", categoryController.deleteCategory)

module.exports = routes