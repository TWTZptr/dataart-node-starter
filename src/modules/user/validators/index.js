const Joi = require('joi');
const {
  ALLOWED_NAME_SYMBOLS,
  NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MIN_LENGTH,
  AVATAR_URL_MAX_LENGTH,
  REQUIRED_PASSWORD_SYMBOLS,
  BLOCKED_PASSWORD_SYMBOLS,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_DOES_NOT_CONTAIN_REQUIRED_SYMBOLS_MESSAGE,
  PASSWORD_CONTAIN_BLOCKED_SYMBOLS_MESSAGE,
} = require('../constants');

const validateUserPassword = (value, helpers) => {
  let result = {
    valid: true,
    errorMessage: '',
  };

  BLOCKED_PASSWORD_SYMBOLS.forEach((symb) => {
    if (value.match(symb)) {
      result.valid = false;
      return (result.errorMessage = PASSWORD_CONTAIN_BLOCKED_SYMBOLS_MESSAGE);
    }
  });

  REQUIRED_PASSWORD_SYMBOLS.forEach((symb) => {
    if (!value.match(symb)) {
      result.valid = false;
      return (result.errorMessage = PASSWORD_DOES_NOT_CONTAIN_REQUIRED_SYMBOLS_MESSAGE);
    }
  });

  if (result.valid) {
    return value;
  } else {
    return helpers.message(result.errorMessage);
  }
};

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
    password: Joi.string()
      .min(PASSWORD_MIN_LENGTH)
      .max(PASSWORD_MAX_LENGTH)
      .custom(validateUserPassword)
      .required(),
  }),
};

module.exports = {
  validateUser,
};
