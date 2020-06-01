const Organisation = require("../models/organisation.model")
const Department = require("../models/department.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllDepartmentsFromOrganisation(req, res, next) {
        const { organisation } = req
        res.status(200).json(organisation.departments).end()
    },

    getDepartmentByID(req, res, next) {
        const { depID } = req.params
        const { organisation } = req
        const dep = organisation.departments.find(dep => dep._id == depID)

        if (dep) res.status(200).json(dep).end()
        else next(new ApiError("NotFound", `No Department with ID '${depID}' found`, 400))
    },

    addDepartment(req, res, next) {
        const { name } = req.body
        const { organisation } = req
        const newDepartment = new Department({ name })

        newDepartment.validate(error => {
            if (!error) {
                if (organisation !== null) {
                    const dups = organisation.departments.find(dep => dep.name == newDepartment.name)
                    if (!dups) { //check for duplicate names in the Departments list
                        organisation.departments.push(newDepartment)
                        organisation.save()
                            .then(() => res.status(201).json(newDepartment).end())
                            .catch(err => next(new ApiError("ServerError", err, 400)))
                    } else next(new ApiError("DuplicateError", `There already exists an Department with name '${newDepartment.name}' in Organisation '${orgID}'`, 400))
                } else next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
            } else next(new ApiError("ValidationError", error, 400))
        })
    },

    updateDepartmentByID(req, res, next) {
        const { depID } = req.params
        const { organisation } = req
        const { name } = req.body

        if (organisation !== null) {
            Organisation.findOneAndUpdate(
                { "_id": organisation._id, "departments._id": depID },
                { $set: { "departments.$.name": name } },
                { new: true }
            )
                .then(updatedDoc => res.status(200).json(updatedDoc).end())
                .catch(err => next(new ApiError("UpdateError", err, 400)))
        } else next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
    },

    deleteDepartmentByID(req, res, next) {
        const { depID } = req.params
        const { organisation } = req
        const newDepartments = organisation.departments.filter(dep => dep._id != depID)
        
        organisation.departments = newDepartments
        organisation.save()
            .then(savedOrg => res.status(200).json(savedOrg).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    }
}