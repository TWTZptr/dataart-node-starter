const jwt = require('jsonwebtoken');
const { TOKEN_EXPIRATION_TIME, SECRET } = require('./constants');

const generateAccessToken = (payload, options = { expiresIn: TOKEN_EXPIRATION_TIME }) =>
  jwt.sign(payload, SECRET, options);

module.exports = {
  generateAccessToken,
};
