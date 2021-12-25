const { s3uploader } = require('../../helpers/s3');
const { S3 } = require('../../config');
const Hashids = require('hashids');
const db = require('../../models');

const hashids = new Hashids(S3.FILENAME_SALT);

const uploadFile = async (userId, stream) => {
  let transaction;
  try {
    const key = generateFilename(userId);

    transaction = await db.sequelize.transaction();

    const file = await createFile({ key, ownerId: userId }, { transaction });

    await s3uploader(stream, key, {
      contentType: stream.headers['content-type'],
    });

    await transaction.commit();

    return {
      ...file.dataValues,
      link: file.link,
    };
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }

    throw err;
  }
};

const generateFilename = (userId) => {
  return `${hashids.encode(userId)}/${hashids.encode(userId, Date.now())}`;
};

const createFile = (file, options) => {
  return db.File.create(file, options);
};

const getFilesByUserOwnerId = (ownerId) => {
  return db.File.findAll({ where: { ownerId } });
};

const findUserFiles = async (userId) => {
  const dbUserFiles = await getFilesByUserOwnerId(userId);

  return dbUserFiles;
};

module.exports = {
  uploadFile,
  findUserFiles,
  createFile,
};
