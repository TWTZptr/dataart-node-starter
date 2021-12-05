const Joi = require('joi');
const { phoneNumberSchema } = require('../../user/validators');
const { passwordSchema } = require('../../user/validators');
const { SMS_CODE_PATTERN } = require('../../sms/constants');

const validateRestorePassword = {
  source: 'body',
  schema: Joi.object({
    password: passwordSchema.required(),
  }),
};

const validateSMSRequest = {
  source: 'body',
  schema: Joi.object({
    phoneNumber: phoneNumberSchema.required(),
  }),
};

const validateSMSCode = {
  source: 'body',
  schema: Joi.object({
    code: Joi.string().pattern(new RegExp(SMS_CODE_PATTERN)).required(),
  }),
};

module.exports = {
  validateRestorePassword,
  validateSMSCode,
  validateSMSRequest,
};
