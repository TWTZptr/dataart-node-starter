const express = require('express');
const jwt = require('jsonwebtoken');
const { validateAuth } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const {
  SECRET,
  INVALID_CREDENTIALS_MESSAGE,
  TOKEN_EXPIRATION_TIME,
} = require('./constants');
const { StatusCodes } = require('http-status-codes');
const { UnauthorizedError } = require('../../utils/errors');

const router = express.Router();

const tryAuth = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const passwordHash = await userService.getUserPasswordHash(email);
    if (passwordHash && (await passwordService.compare(password, passwordHash))) {
      const accessToken = jwt.sign({ email }, SECRET, {
        expiresIn: TOKEN_EXPIRATION_TIME,
      });

      res.sendResponse(StatusCodes.OK, { accessToken });
    } else {
      next(new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE));
    }
  } catch (err) {
    next(err);
  }
};

router.post('/', validator(validateAuth), tryAuth);

module.exports = router;
