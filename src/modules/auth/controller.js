const express = require('express');
const { validateAuth, validateRefresh } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');
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

    const bearerToken = authService.processTokenPair(res, tokenPair);

    user.password = undefined;
    return res.sendResponse(StatusCodes.OK, { accessToken: bearerToken, user });
  } catch (err) {
    return next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const tokenPair = await authService.regenerateTokens({
      accessToken: oldAccessToken,
      refreshToken: oldRefreshToken,
    });

    const bearerToken = authService.processTokenPair(res, tokenPair);

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
router.post('/refreshment', validator(validateRefresh), refreshToken);
router.post('/out', logout);

module.exports = router;
