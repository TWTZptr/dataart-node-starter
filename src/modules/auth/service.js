const jwt = require('jsonwebtoken');
const { AUTH } = require('../../config');

const generateToken = (
  payload,
  secret = AUTH.ACCESS_TOKEN_SECRET,
  options = { expiresIn: AUTH.ACCESS_TOKEN_EXPIRATION_TIME },
) => jwt.sign(payload, secret, options);

const generateTokenPair = (
  payload,
  secretPair = { refreshTokenSecret: AUTH.REFRESH_TOKEN_SECRET },
  options = { refreshTokenOptions: { expiresIn: AUTH.REFRESH_TOKEN_EXPIRATION_TIME } },
) => {
  return {
    accessToken: generateToken(
      payload,
      secretPair.accessTokenSecret,
      options.accessTokenOptions,
    ),
    refreshToken: generateToken(
      payload,
      secretPair.refreshTokenSecret,
      options.refreshTokenOptions,
    ),
  };
};

const processTokenPair = (res, tokenPair) => {
  res.cookie('refreshToken', tokenPair.refreshToken, {
    httpOnly: true,
    maxAge: AUTH.REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return `Bearer ${tokenPair.accessToken}`;
};

module.exports = {
  generateToken,
  generateTokenPair,
  processTokenPair,
};
