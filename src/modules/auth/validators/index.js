const Joi = require('joi');
const { EMAIL_MAX_LENGTH } = require('../../user/constants');
const { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } = require('../../password/constants');
const passwordService = require('../../password/service');

const validateAuth = {
  source: 'body',
  schema: Joi.object({
    email: Joi.string().email().max(EMAIL_MAX_LENGTH).required(),
    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH)
      .custom(passwordService.validate)
      .required(),
  }),
};

module.exports = {
  validateAuth,
};
