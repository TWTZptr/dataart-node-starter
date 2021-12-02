const express = require('express');
const resetService = require('./resetService');
const validator = require('../../middlewares/validator');
const { validateSMSCode, validateSMSRequest } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const authMiddleware = require('../../middlewares/auth');
const { validateRestorePassword } = require('./validators');

const router = express.Router();
const SMSRequest = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    await resetService.sendSMSCode(phoneNumber);
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

const checkSMSCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { userId } = await resetService.verifyCode(code);
    await resetService.useCode(res, { code, userId });
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

const restorePassword = async (req, res, next) => {
  try {
    const { userId } = req.payload;
    const newPassword = req.body.password;
    await resetService.changePassword(userId, newPassword);
    await res.clearCookie('restorePasswordToken');
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

router.post('/sms', validator(validateSMSRequest), SMSRequest);
router.post('/sms/verification', validator(validateSMSCode), checkSMSCode);
router.put(
  '/',
  authMiddleware.restorePassword,
  validator(validateRestorePassword),
  restorePassword,
);

module.exports = router;
