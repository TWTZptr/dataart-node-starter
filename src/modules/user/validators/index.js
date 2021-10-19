const Joi = require('joi');
const { ALLOWED_NAME_SYMBOLS } = require('../constants');

const validateUser = {
  source: 'body',
  schema: Joi.object({
    email: Joi.string().email().max(255).required(),
    name: Joi.string()
      .min(5)
      .max(25)
      .pattern(new RegExp(`^[a-zA-Z0-9${ALLOWED_NAME_SYMBOLS.join()}]+$`))
      .required(),
    avatarUrl: Joi.string().max(255).uri(),
  }),
};

module.exports = {
  validateUser,
};
