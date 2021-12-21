const { s3Uploader, findObjectsByUserId } = require('../../helpers/s3');
const { ALLOWED_FILE_EXTENSIONS } = require('./constants');

const uploadFiles = (req) => {
  return s3Uploader(req, { extensions: ALLOWED_FILE_EXTENSIONS });
};

const findUserFiles = (userId) => {
  return findObjectsByUserId(userId);
};

module.exports = {
  uploadFiles,
  findUserFiles,
};
