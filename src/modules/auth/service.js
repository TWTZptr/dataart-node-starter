const jwt = require('jsonwebtoken');
const { SECRET } = require('./constants');

const generateAccessToken = (payload, options) => jwt.sign(payload, SECRET, options);

module.exports = {
  generateAccessToken,
};
