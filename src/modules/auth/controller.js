const express = require('express');
const { validateAuth, validateRefresh } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');
const { AUTH } = require('../../config');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const router = express.Router();

const tryAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUser({ email });
    await passwordService.compare(password, user && user.password);

    const tokenPair = authService.generateTokenPair({
      id: user.id,
      email: user.email,
    });

    const bearerToken = processTokenPair(res, tokenPair);

    user.password = undefined;
    return res.sendResponse(StatusCodes.OK, { accessToken: bearerToken, user });
  } catch (err) {
    return next(err);
  }
};

const processTokenPair = (res, tokenPair) => {
  res.cookie('refreshToken', tokenPair.refreshToken, {
    httpOnly: true,
    maxAge: AUTH.REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return `Bearer ${tokenPair.accessToken}`;
};

const refreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const tokenPair = await authService.regenerateTokens({
      accessToken: oldAccessToken,
      refreshToken: oldRefreshToken,
    });

    const bearerToken = processTokenPair(res, tokenPair);

    return res.sendResponse(StatusCodes.OK, { bearerToken });
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res, next) => {
  res.clearCookie('refreshToken');
  return res.sendResponse(StatusCodes.OK);
};

router.post('/', validator(validateAuth), tryAuth);
router.post('/refresh-token', validator(validateRefresh), refreshToken);
router.post('/logout', logout);

module.exports = router;
