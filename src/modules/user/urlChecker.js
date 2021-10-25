const https = require('https');
const http = require('http');
const {
  ALLOWED_AVATAR_CONTENT_TYPES,
  AVATAR_URL_IS_NOT_RESPONDING_MESSAGE,
  AVATAR_URL_IS_INCORRECT_MESSAGE,
  ALLOWED_AVATAR_START_BITS,
} = require('./constants');
const { ValidationError } = require('../../utils/errors');

const doesAvatarUrlContainImage = async (url) => {
  return new Promise((resolve, reject) => {
    const callback = (response) => {
      response.on('data', (chunk) => {
        const firstBits = chunk.toString('hex', 0, 4);
        if (
          ALLOWED_AVATAR_CONTENT_TYPES.includes(response.headers['content-type']) &&
          ALLOWED_AVATAR_START_BITS.includes(firstBits)
        ) {
          response.destroy();
          return resolve();
        }
        return reject(new ValidationError(AVATAR_URL_IS_INCORRECT_MESSAGE));
      });
    };

    const avatarUrl = new URL(url);

    const getRequest =
      avatarUrl.protocol === 'http:'
        ? http.get(avatarUrl, callback)
        : https.get(avatarUrl, callback);

    getRequest.on('error', () => {
      return reject(new ValidationError(AVATAR_URL_IS_NOT_RESPONDING_MESSAGE));
    });
  });
};

module.exports = doesAvatarUrlContainImage;
