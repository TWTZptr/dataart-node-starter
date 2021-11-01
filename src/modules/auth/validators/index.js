const Joi = require('joi');

const validateAuth = {
  source: 'body',
  schema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  validateAuth,
};
