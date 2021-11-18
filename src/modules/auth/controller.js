const express = require('express');
const { validateAuth, validateLogout } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');
const authMiddleware = require('../../middlewares/auth');
const { UnauthorizedError } = require('../../utils/errors');
const { INVALID_TOKEN_MESSAGE } = require('./constants');

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
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      return next(new UnauthorizedError(INVALID_TOKEN_MESSAGE));
    }

    const tokenPair = authService.generateTokenPair({
      id: req.user.id,
      email: req.user.email,
    });

    const bearerToken = authService.processTokenPair(res, tokenPair);

    return res.sendResponse(StatusCodes.OK, { accessToken: bearerToken });
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res, next) => {
  res.clearCookie('refreshToken');
  return res.sendResponse(StatusCodes.OK);
};

router.post('/', validator(validateAuth), tryAuth);
router.put('/', authMiddleware.refresh, refreshToken);
router.delete('/', validator(validateLogout), logout);

module.exports = router;
