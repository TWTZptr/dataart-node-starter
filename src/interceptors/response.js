const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) => {
  res.sendResponse = (status = StatusCodes.OK, data = {}, rest) => {
    res
      .status(status)
      .json({
        data,
        ...rest,
      })
      .end();
  };
  return next();
};
