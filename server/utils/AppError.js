/**
 * This AppError class will be used all over the back-end to return
 * http response messages.
 */
class AppError extends Error {
    constructor(message, statusCode, customMessages) {
        // Pass the message to the built-in Error class
        super(message);

        // Set the HTTP status code.
        this.statusCode = statusCode;

        // This helps distinguish these from programming bugs
        this.isOperational = true;

        // This for any custom messages.
        this.customMessages = customMessages | {};

        // Capture the stack race, excluding this constructor
        Error.captureStackTrace(this, this.constructor);
    }
}


module.exports = AppError;