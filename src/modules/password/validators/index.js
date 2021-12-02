const Joi = require('joi');
const {
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
} = require('../../user/constants');
const userService = require('../../user/service');
const passwordService = require('../service');

const validateSMSRequest = {
  source: 'body',
  schema: Joi.object({
    phoneNumber: Joi.string()
      .custom(userService.validatePhoneNumber)
      .min(PHONE_NUMBER_MIN_LENGTH)
      .max(PHONE_NUMBER_MAX_LENGTH)
      .required(),
  }),
};

const validateSMSCode = {
  source: 'body',
  schema: Joi.object({
    code: Joi.string().required(),
  }),
};

const validateRestorePassword = {
  source: 'body',
  schema: Joi.object({
    password: Joi.string().custom(passwordService.validate).required(),
  }),
};

module.exports = {
  validateSMSCode,
  validateSMSRequest,
  validateRestorePassword,
};
