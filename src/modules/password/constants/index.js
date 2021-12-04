module.exports = {
  REQUIRED_PASSWORD_SYMBOLS: [/[a-z]/, /[A-Z]/, /[0-9]/, /[!~^&*_#@]/],
  BLOCKED_PASSWORD_SYMBOLS: [/[а-яА-Я ]/],
  PASSWORD_MAX_LENGTH: 25,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_DOES_NOT_CONTAIN_REQUIRED_SYMBOLS_MESSAGE:
    'Password should contain at least 1 cap letter, 1 default letter, 1 number and 1 specific symbol like !~^&*_#@',
  PASSWORD_CONTAIN_BLOCKED_SYMBOLS_MESSAGE:
    "Password can't contain spaces or cyrillic symbols",
  PASSWORD_HASHING_SALT_ROUNDS: 10,
  FORBIDDEN_ERROR_MESSAGE: 'Forbidden',
};
