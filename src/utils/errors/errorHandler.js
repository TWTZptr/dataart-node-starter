const { ServerError } = require('./index');

module.exports = (err, req, res, _next) => {
  //in case of unknown error type - throw Internal Server Error
  if (!(err instanceof ServerError)) {
    console.error(err.message, err.stack);
    err = new ServerError('Something went wrong');
  }

  return res.status(err.status).json(err.response).end();
};
