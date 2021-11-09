const jwt = require('jsonwebtoken');
const { AUTH } = require('../../config');

const generateAccessToken = (
  payload,
  options = { expiresIn: AUTH.TOKEN_EXPIRATION_TIME },
) => jwt.sign(payload, AUTH.SECRET, options);

module.exports = {
  generateAccessToken,
};
