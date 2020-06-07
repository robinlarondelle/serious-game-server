const ApiError = require("../models/apiError.model")

module.exports = {
    findDepartmentByID(req, res, next) {
        const { organisation } = req
        const { depID } = req.params
        const department = organisation.departments.find(dep => dep._id == depID)

        if (department) {
            req.department = department
            next()
        } else next(new ApiError("NotFound", `The department with ID ${depID} was not found in organisation '${organisation.name}'`))
    }
}