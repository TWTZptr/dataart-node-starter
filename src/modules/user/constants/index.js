module.exports = {
  ALLOWED_NAME_SYMBOLS: ['_', '$', '!', '~', '^'],
  EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE: 'User with that email already exists',
  EMAIL_MAX_LENGTH: 255,
  NAME_MAX_LENGTH: 25,
  NAME_MIN_LENGTH: 5,
  AVATAR_URL_MAX_LENGTH: 255,
  INVALID_AVATAR_URL_MESSAGE: 'Avatar url should contain a picture!',
  ALLOWED_AVATAR_CONTENT_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_AVATAR_START_BITS: ['ffd8ffe0', '89504e47', '47494638'],
  AVATAR_URL_IS_NOT_RESPONDING_MESSAGE: 'Avatar url is not responding',
  AVATAR_URL_IS_INCORRECT_MESSAGE: 'Avatar url does not provide a valid picture',
  REQUIRED_PASSWORD_SYMBOLS: [/[a-z]/, /[A-Z]/, /[0-9]/, /[!~^&*_#@]/],
  BLOCKED_PASSWORD_SYMBOLS: [/[а-яА-Я ]/],
  PASSWORD_MAX_LENGTH: 25,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_DOES_NOT_CONTAIN_REQUIRED_SYMBOLS_MESSAGE:
    'Password should contain at least 1 cap letter, 1 default letter, 1 number and 1 specific symbol like !~^&*_#@',
  PASSWORD_CONTAIN_BLOCKED_SYMBOLS_MESSAGE:
    "Password can't contain spaces or cyrillic symbols",
  PASSWORD_HASHING_SALT_ROUNDS: 10,
};
