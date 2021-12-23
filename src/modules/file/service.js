const { findObjectsByUserId, s3uploader, generateS3link } = require('../../helpers/s3');
const { FORBIDDEN_FILE_EXTENSION, ALLOWED_FILE_EXTENSIONS } = require('./constants');
const { S3 } = require('../../config');
const Hashids = require('hashids');
const db = require('../../models');

const hashids = new Hashids(S3.FILENAME_SALT);

const uploadFileFromPart = async (userId, part) => {
  let transaction;
  try {
    const extension = part.filename.split('.').at(-1);
    if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
      part.resume();
      return { success: false, error: FORBIDDEN_FILE_EXTENSION };
    }

    const s3key = generateFilename(userId, extension);

    transaction = await db.sequelize.transaction();
    const file = await createFile(
      {
        s3key,
        ownerId: userId,
        extension,
        originalName: part.filename,
      },
      { transaction },
    );

    await s3uploader(part, s3key, {
      contentType: part.headers['content-type'],
    });
    await transaction.commit();
    return {
      ...file.dataValues,
      link: generateS3link(s3key),
      success: true,
      error: null,
    };
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }

    throw err;
  }
};

const generateFilename = (userId, extension) => {
  return `${hashids.encode(userId)}/${hashids.encode(userId, Date.now())}.${extension}`;
};

const createFile = (file, options) => {
  return db.File.create(file, options);
};

const getFilesByUserOwnerId = (ownerId) => {
  return db.File.findAll({ where: { ownerId } });
};

const findUserFiles = async (userId) => {
  const s3UserFiles = await findObjectsByUserId(userId);
  const dbUserFiles = await getFilesByUserOwnerId(userId);
  const userFiles = [];

  dbUserFiles.forEach((dbFile) => {
    s3UserFiles.every((s3File) => {
      if (s3File.Key === dbFile.s3key) {
        userFiles.push({
          ...dbFile.dataValues,
          size: s3File.Size,
          link: generateS3link(s3File.Key),
        });
        return false;
      }
      return true;
    });
  });

  return userFiles;
};

module.exports = {
  uploadFileFromPart,
  findUserFiles,
  createFile,
};
