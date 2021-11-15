const jwt = require('jsonwebtoken');
const { AUTH } = require('../../config');
const { UnauthorizedError } = require('../../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../auth/constants');
const userService = require('../user/service');

const generateAccessToken = (
  payload,
  options = { expiresIn: AUTH.ACCESS_TOKEN_EXPIRATION_TIME },
) => jwt.sign(payload, AUTH.ACCESS_TOKEN_SECRET, options);

const generateRefreshToken = (
  payload,
  options = { expiresIn: AUTH.REFRESH_TOKEN_EXPIRATION_TIME },
) => jwt.sign(payload, AUTH.REFRESH_TOKEN_SECRET, options);

const generateTokenPair = (payload, options = {}) => {
  return {
    accessToken: generateAccessToken(payload, options.accessTokenOptions),
    refreshToken: generateRefreshToken(payload, options.refreshTokenOptions),
  };
};

const regenerateTokens = async (oldTokenPair) => {
  try {
    jwt.verify(oldTokenPair.refreshToken, AUTH.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new UnauthorizedError(INVALID_TOKEN_MESSAGE);
  }

  const { payload: refreshTokenPayload } = jwt.decode(oldTokenPair.refreshToken, {
    complete: true,
  });

  const { payload: accessTokenPayload } = jwt.decode(oldTokenPair.accessToken, {
    complete: true,
  });

  if (
    refreshTokenPayload.email != accessTokenPayload.email ||
    refreshTokenPayload.id != accessTokenPayload.id
  ) {
    throw new UnauthorizedError(INVALID_TOKEN_MESSAGE);
  }

  const user = await userService.getUser({ id: refreshTokenPayload.id });
  if (!user || user.email != refreshTokenPayload.email) {
    throw new UnauthorizedError(INVALID_TOKEN_MESSAGE);
  }

  return generateTokenPair({
    email: refreshTokenPayload.email,
    id: refreshTokenPayload.id,
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  regenerateTokens,
  generateTokenPair,
};
