const Logger = require('../logger');
const { StatusCodes } = require('http-status-codes');

class BusinessLogicError extends Error {
  name = 'BaseError';
  constructor(error) {
    const message = error instanceof Error ? error.message : error;
    super(message);
    this.message = message || StatusCodes.getStatusText(this.status);
  }
  get status() {
    return StatusCodes.BAD_REQUEST;
  }

  get response() {
    const logger = new Logger(this.name);
    const error = {
      statusCode: this.status,
      error: this.message,
    };
    logger.error(error);
    return error;
  }
}

class ServerError extends BusinessLogicError {
  name = 'ServerError';
  get status() {
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

class NotFoundError extends ServerError {
  name = 'NotFoundError';
  get status() {
    return StatusCodes.NOT_FOUND;
  }
}

class ValidationError extends ServerError {
  name = 'ValidationError';
  get status() {
    return StatusCodes.BAD_REQUEST;
  }
}

class UnauthorizedError extends ServerError {
  name = 'UnauthorizedError';
  get status() {
    return StatusCodes.UNAUTHORIZED;
  }
}

function error404Handler(req, res, next) {
  return next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
}

module.exports = {
  ServerError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  error404Handler,
};
