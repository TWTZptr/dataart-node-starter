const http = require('http');
const app = require('./app');
const config = require('./config');
const Logger = require('./utils/logger');

async function bootstrap() {
  const logger = new Logger('Main');
  http.createServer(app).listen(config.APP.PORT, () => {
    logger.info(`Web server successfully started at port: ${config.APP.PORT}`);
  });
}

bootstrap();
