module.exports = class ApiError {
    constructor(error = undefined, message, status) {
        this.error = error
        this.message = message
        this.code = status
    }
}