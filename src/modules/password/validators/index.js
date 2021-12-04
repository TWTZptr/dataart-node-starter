const Joi = require('joi');
const passwordService = require('../service');
const { phoneNumberSchema } = require('../../user/validators');

const validateRestorePassword = {
  source: 'body',
  schema: Joi.object({
    password: Joi.string().custom(passwordService.validate).required(),
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
    code: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]+$')).required(),
  }),
};

module.exports = {
  validateRestorePassword,
  validateSMSCode,
  validateSMSRequest,
};
