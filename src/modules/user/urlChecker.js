const https = require('https');
const {
  ALLOWED_AVATAR_CONTENT_TYPES,
  AVATAR_URL_IS_NOT_RESPONDING_MESSAGE,
  AVATAR_URL_IS_INCORRECT_MESSAGE,
  ALLOWED_AVATAR_START_BITS,
} = require('./constants');

const doesAvatarUrlContainImage = async (url) => {
  return new Promise((resolve, reject) => {
    try {
      const callback = (response) => {
        response.on('data', (chunk) => {
          const firstBits = chunk.toString('hex', 0, 4);
          if (
            ALLOWED_AVATAR_CONTENT_TYPES.indexOf(response.headers['content-type']) !=
              -1 &&
            ALLOWED_AVATAR_START_BITS.indexOf(firstBits) != -1
          ) {
            response.destroy();
            resolve();
          }
          resolve(AVATAR_URL_IS_INCORRECT_MESSAGE);
        });
      };

      const getRequest = https.get(url, callback);
      getRequest.on('error', () => {
        resolve(AVATAR_URL_IS_NOT_RESPONDING_MESSAGE);
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = doesAvatarUrlContainImage;
