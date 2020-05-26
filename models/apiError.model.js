module.exports = class ApiError {
    constructor(message, status) {
        this.message = message
        this.code = status
    }
}