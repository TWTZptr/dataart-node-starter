const express = require('express');
const validator = require('../../middlewares/validator');
const { StatusCodes } = require('http-status-codes');
const authMiddleware = require('../../middlewares/auth');
const { validateRestorePassword } = require('./validators');
const smsController = require('../sms/controller');
const userService = require('../user/service');

const router = express.Router();

const restorePassword = async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const newPassword = req.body.password;
    await userService.changeUserPassword(userId, newPassword);
    await res.clearCookie('restorePasswordToken');
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

router.put(
  '/',
  authMiddleware.restorePassword,
  validator(validateRestorePassword),
  restorePassword,
);

router.use('/sms', smsController);

module.exports = router;
