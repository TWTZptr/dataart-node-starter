const express = require('express');
const { validateAuth } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { INVALID_CREDENTIALS_MESSAGE, TOKEN_EXPIRATION_TIME } = require('./constants');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError } = require('../../utils/errors');
const authService = require('./service');

const router = express.Router();

const tryAuth = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUser(email);
    if (user) {
      await passwordService.compare(password, user.password);
      const accessToken = authService.generateAccessToken(
        { id: user.id, email: user.email },
        { expiresIn: TOKEN_EXPIRATION_TIME },
      );

      return res.sendResponse(StatusCodes.OK, { accessToken });
    } else {
      return next(new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE));
    }
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateAuth), tryAuth);

module.exports = router;
