const express = require('express');
const { validateAuth } = require('./validators');
const validator = require('../../middlewares/validator');
const passwordService = require('../password/service');
const userService = require('../user/service');
const { StatusCodes } = require('http-status-codes');
const authService = require('./service');

const router = express.Router();

const tryAuth = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUser({ email });
    await passwordService.compare(password, user && user.password);

    const accessToken = authService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    return res.sendResponse(StatusCodes.OK, { accessToken });
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateAuth), tryAuth);

module.exports = router;
