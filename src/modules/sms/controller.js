const express = require('express');
const smsService = require('./service');
const validator = require('../../middlewares/validator');
const { validateSMSCode, validateSMSRequest } = require('./validators');
const { StatusCodes } = require('http-status-codes');

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
    const { userId } = await smsService.verifySMSCode(code);
    await smsService.useSMSCode(res, { code, userId });
    return res.sendResponse(StatusCodes.OK);
  } catch (err) {
    return next(err);
  }
};

const router = express.Router();

router.post('/', validator(validateSMSRequest), SMSRequest);
router.post('/verification', validator(validateSMSCode), checkSMSCode);

module.exports = router;
