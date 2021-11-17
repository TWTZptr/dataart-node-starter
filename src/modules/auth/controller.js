const express = require('express');
const { validateAuth, validateRefresh } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');
const authMiddleware = require('../../middlewares/auth');

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
    const tokenPair = authService.generateTokenPair({
      id: req.user.id,
      email: req.user.email,
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
router.post('/refreshment', authMiddleware.refresh, refreshToken);
router.post('/out', logout);

module.exports = router;
