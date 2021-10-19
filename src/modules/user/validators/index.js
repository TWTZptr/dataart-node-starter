const Joi = require('joi');
const {
  ALLOWED_NAME_SYMBOLS,
  NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MIN_LENGTH,
  AVATAR_URL_MAX_LENGTH,
} = require('../constants');

const validateUser = {
  source: 'body',
  schema: Joi.object({
    email: Joi.string().email().max(EMAIL_MAX_LENGTH).required(),
    name: Joi.string()
      .min(NAME_MIN_LENGTH)
      .max(NAME_MAX_LENGTH)
      .pattern(new RegExp(`^[a-zA-Z0-9${ALLOWED_NAME_SYMBOLS.join()}]+$`))
      .required(),
    avatarUrl: Joi.string().max(AVATAR_URL_MAX_LENGTH).uri(),
  }),
};

module.exports = {
  validateUser,
};
