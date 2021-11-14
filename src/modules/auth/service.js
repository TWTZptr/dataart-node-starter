const jwt = require('jsonwebtoken');
const { AUTH } = require('../../config');

const generateAccessToken = (
  payload,
  options = { expiresIn: AUTH.ACCESS_TOKEN_EXPIRATION_TIME },
) => jwt.sign(payload, AUTH.ACCESS_TOKEN_SECRET, options);

module.exports = {
  generateAccessToken,
};
