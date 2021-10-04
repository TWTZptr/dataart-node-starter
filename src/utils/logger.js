const { yellow, blackBright } = require('chalk');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize, simple } = format;

const colorizer = colorize();

class Logger {
  constructor(labelVal = 'Logger') {
    return createLogger({
      level: 'info',
      format: combine(
        timestamp({
          format: 'DD/MM/YYYY, hh:mm:ss A',
        }),
        simple(),
        label({ label: labelVal }),
        printf((msg) => {
          if (typeof msg.message === 'object') {
            msg.message = JSON.stringify(msg.message);
          }
          return colorizer.colorize(
            msg.level,
            yellow(`[${msg.label}]`) +
              ' ' +
              blackBright(`${msg.timestamp}`) +
              ` - ${msg.level}: ${msg.message}`,
          );
        }),
      ),
      transports: [new transports.Console()],
      exitOnError: false,
      exceptionHandlers: [
        new transports.Console({
          format: format.simple(),
        }),
      ],
    });
  }
}

module.exports = Logger;
