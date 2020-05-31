const Organisation = require("../models/organisation.model")
const Department = require("../models/department.model")
const ApiError = require("../models/apiError.model")

module.exports = {
    getAllDepartmentsFromOrganisation(req, res, next) {
        const { orgID } = req.params

        Organisation.findById(orgID)
            .then(organisation => {
                if (organisation === null) next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
                else res.status(200).json(organisation.departments).end()
            })
            .catch(err => next(new ApiError("ServerError", err, 400)))
    },

    getDepartmentByID(req, res, next) {
        const { orgID, depID } = req.params

        Organisation.findById(orgID)
            .then(organisation => {                               
                const dep = organisation.departments.find(dep => dep.depID == depID)
                if (dep) res.status(200).json(dep).end()
                else next(new ApiError("NotFound", `No Department with ID '${depID}' found`, 400))
            })
    },

    addDepartment(req, res, next) {
        const { name } = req.body
        const { orgID } = req.params

        const newDepartment = new Department({ name })
        newDepartment.validate(error => {
            if (!error) {
                Organisation.findById(orgID).then(organisation => {
                    if (organisation !== null) {
                        const dups = organisation.departments.find(dep => dep.name == newDepartment.name)
                        if (!dups) { //check for duplicate names in the Departments list
                            organisation.departments.push(newDepartment)
                            organisation.save()
                            .then(() => res.status(201).json(newDepartment).end())
                            .catch(err => next(new ApiError("ServerError", err, 400)))
                        } else next(new ApiError("DuplicateError", `There already exists an Department with name '${newDepartment.name}' in Organisation '${orgID}'`, 400))
                    } else next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
                }).catch(err => next(new ApiError("ServerError", err, 400)))
            } else next(new ApiError("ValidationError", error, 400))
        })
    },

    updateDepartmentByID(req, res, next) {
        const {orgID, depID} = req.params
        const {name} = req.body

        Organisation.findById(orgID).then(org => {
            if (org !== null) {
                Organisation.findOneAndUpdate(
                    {"_id":orgID, "departments._id": depID},
                    {$set: {"departments.$.name": name}},
                    {new: true}
                )
                .then(updatedDoc => res.status(200).json(updatedDoc).end())
                .catch(err => next(new ApiError("UpdateError", err, 400)))
            } else next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
        }).catch(err => next(new ApiError("ServerError", err, 400)))
    },

    deleteDepartmentByID(req, res, next) {
        const {orgID, depID} = req.params

        Organisation.findById(orgID).then(org => {
            if (org !== null) {
                const updatedDeps = org.departments.filter(dep => dep._id != depID)
                org.departments = updatedDeps
                org.save()
                    .then(savedOrg => res.status(200).json(savedOrg).end())
                    .catch(err => next(new ApiError("ServerError", err, 400)))
            } else next(new ApiError("NotFound", `No Organisation found with ID '${orgID}'`, 404))
        }).catch(err => next(new ApiError("ServerError", err, 400)))

    }
}