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
};
