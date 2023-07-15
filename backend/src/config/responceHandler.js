const httpStatus = require('http-status')

const handleResponse = (res, statusCode, status, message, data) => {
    return res.status(statusCode).json({
        status, message, data
    })
}

const successResponse = (res, message = 'Operation successful', data, code = httpStatus.OK) => {
    return res.status(code).json({
        status: true, 
        message, data
    })
}

const errorResponse = (res, message = 'An error occurred', data, code = httpStatus.INTERNAL_SERVER_ERROR) => {
    return res.status(code).json({
        status: false,
        message, data
    })
}

const badRequest = (res, message = 'An error occurred', data, statusCode = httpStatus.BAD_REQUEST) => {
    return res.status(statusCode).json({
        status: false,
        message, data
    })
}

const socketEmit = (io, endPoint , message = 'Updated.', data = []) => {
    return io && io.emit(endPoint, {message, data})
}

module.exports = {
    handleResponse, successResponse, errorResponse, badRequest, socketEmit
} 