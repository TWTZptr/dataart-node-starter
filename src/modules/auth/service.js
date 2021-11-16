const jwt = require('jsonwebtoken');
const { AUTH } = require('../../config');
const { UnauthorizedError } = require('../../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('../auth/constants');
const userService = require('../user/service');

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

  if (refreshTokenPayload.id !== accessTokenPayload.id) {
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

const processTokenPair = (res, tokenPair) => {
  res.cookie('refreshToken', tokenPair.refreshToken, {
    httpOnly: true,
    maxAge: AUTH.REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return `Bearer ${tokenPair.accessToken}`;
};

module.exports = {
  generateToken,
  regenerateTokens,
  generateTokenPair,
  processTokenPair,
};
