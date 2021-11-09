const express = require('express');
const { validateAuth } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');

const router = express.Router();

const tryAuth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUser({ email });
    await passwordService.compare(password, user && user.password);

    const accessToken = authService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    user.password = undefined;
    return res.sendResponse(StatusCodes.OK, { accessToken, user });
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateAuth), tryAuth);

module.exports = router;
