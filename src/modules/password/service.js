const {
  PASSWORD_CONTAIN_BLOCKED_SYMBOLS_MESSAGE,
  PASSWORD_DOES_NOT_CONTAIN_REQUIRED_SYMBOLS_MESSAGE,
  BLOCKED_PASSWORD_SYMBOLS,
  REQUIRED_PASSWORD_SYMBOLS,
  PASSWORD_HASHING_SALT_ROUNDS,
} = require('./constants');
const { INVALID_CREDENTIALS_MESSAGE } = require('../auth/constants');
const bcrypt = require('bcrypt');
const { UnauthorizedError } = require('../../utils/errors');

const validate = (value, helpers) => {
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

const hash = async (password) => {
  const salt = await bcrypt.genSalt(PASSWORD_HASHING_SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

const compare = async (password, hash) => {
  const comparePasswords = hash && (await bcrypt.compare(password, hash));
  if (!comparePasswords) {
    throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
  }
  return;
};

module.exports = {
  validate,
  hash,
  compare,
};
