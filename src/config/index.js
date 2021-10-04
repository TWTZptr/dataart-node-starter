require('dotenv').config();

const { APP_HOST, APP_PORT } = process.env;

module.exports = {
  APP: {
    HOST: APP_HOST || 'localhost',
    PORT: APP_PORT || 4005,
    JSON_REQUEST_LIMIT: '50mb',
    RAW_REQUEST_LIMIT: '50mb',
  },
};
