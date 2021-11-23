const Joi = require('joi');
const {
  ALLOWED_NAME_SYMBOLS,
  NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MIN_LENGTH,
  AVATAR_URL_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBER_MAX_LENGTH,
} = require('../constants');
const { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } = require('../../password/constants');
const passwordService = require('../../password/service');
const userService = require('../service');

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
      .custom(passwordService.validate)
      .required(),
    phoneNumber: Joi.string()
      .custom(userService.validatePhoneNumber)
      .min(PHONE_NUMBER_MIN_LENGTH)
      .max(PHONE_NUMBER_MAX_LENGTH)
      .required(),
  }),
};

const validateUserUpdate = {
  source: 'body',
  schema: Joi.object({
    phoneNumber: Joi.string()
      .custom(userService.validatePhoneNumber)
      .min(PHONE_NUMBER_MIN_LENGTH)
      .max(PHONE_NUMBER_MAX_LENGTH),
  }),
};

module.exports = {
  validateUser,
  validateUserUpdate,
};
