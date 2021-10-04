const Logger = require('./logger');

let reqId = 0;

module.exports = (req, res, next) => {
  reqId++;
  const logger = new Logger('RequestLog');
  const start = new Date();
  logger.info({
    reqId,
    time: start.getTime(),
    req: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    },
    msg: 'incoming request',
  });

  require('on-headers')(res, () => {
    const end = new Date();
    logger.info({
      reqId,
      time: end.getTime(),
      responseTime: `${end.getTime() - start.getTime()}ms`,
      res: { statusCode: res.statusCode },
      msg: 'request completed',
    });
  });

  return next();
};
