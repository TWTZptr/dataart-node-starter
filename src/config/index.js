require('dotenv').config();

const {
  APP_HOST,
  APP_PORT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION_TIME,
} = process.env;
const database = require('./database');

module.exports = {
  APP: {
    HOST: APP_HOST || 'localhost',
    PORT: APP_PORT || 4005,
    JSON_REQUEST_LIMIT: '50mb',
    RAW_REQUEST_LIMIT: '50mb',
  },
  DATABASE: database,
  AUTH: {
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION_TIME,
  },
};
