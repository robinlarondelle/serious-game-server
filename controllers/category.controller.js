const ApiError = require("../models/apiError.model")
const Category = require("../models/category.model")

module.exports = {
    getAllCategories(req, res, next) {
        Category.find({}).then(categories => {
            res.status(200).json(categories).end()
        })
    },

    addCategory(req, res, next) {
        const { name } = req.body
        const newCategory = new Category({ name })

        newCategory.save()
            .then(() => Category.find({}))
            .then(allCategories => res.status(200).json(allCategories).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    },

    updateCategory(req, res, next) {
        const { catID } = req.params
        const { name } = req.body
        Category.findOneAndUpdate({ _id: catID }, { name }, { new: true })
            .then(() => Category.find({}))
            .then(allCategories => res.status(200).json(allCategories).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    },

    deleteCategory(req, res, next) {
        const { catID } = req.params
        Category.findOneAndDelete({ _id: catID })
            .then(() => Category.find({}))
            .then(allCategories => res.status(200).json(allCategories).end())
            .catch(err => next(new ApiError("ServerError", err, 400)))
    }
}