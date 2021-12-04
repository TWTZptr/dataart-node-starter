const Joi = require('joi');
const passwordService = require('../service');

const validateRestorePassword = {
  source: 'body',
  schema: Joi.object({
    password: Joi.string().custom(passwordService.validate).required(),
  }),
};

module.exports = {
  validateRestorePassword,
};
