const express = require('express');
const validator = require('../../middlewares/validator');
const { StatusCodes } = require('http-status-codes');
const authMiddleware = require('../../middlewares/auth');
const {
  validateRestorePassword,
  validateSMSCode,
  validateSMSRequest,
} = require('./validators');
const userService = require('../user/service');
const smsService = require('../sms/service');

const router = express.Router();

const restorePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const newPassword = req.body.password;
    await userService.changeUserPassword(id, newPassword);
    await res.clearCookie('restorePasswordToken');
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

const SMSRequest = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    await smsService.sendSMSCode(phoneNumber);
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

const checkSMSCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { id } = await smsService.verifySMSCode(code);
    await smsService.useSMSCode(res, { code, id });
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

router.post('/sms-dispatcher', validator(validateSMSRequest), SMSRequest);
router.post('/smscode-verification', validator(validateSMSCode), checkSMSCode);
router.put(
  '/',
  authMiddleware.restorePassword,
  validator(validateRestorePassword),
  restorePassword,
);

module.exports = router;
