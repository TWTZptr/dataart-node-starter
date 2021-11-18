const { doesUrlContainAnImage } = require('../../helpers/urlChecker');
const { EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE } = require('./constants');
const db = require('../../models');
const { ValidationError } = require('../../utils/errors');
const passwordService = require('../password/service');

const createUser = async (data) => {
  const { name, email, password, avatarUrl } = data;
  try {
    if (avatarUrl) {
      await doesUrlContainAnImage(avatarUrl);
    }

    const passwordHash = await passwordService.hash(password);

    const user = await db.User.create({
      name,
      email,
      avatarUrl,
      password: passwordHash,
    });

    return user;
  } catch (err) {
    if (err instanceof db.Sequelize.UniqueConstraintError) {
      throw new ValidationError(EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE);
    }
    throw err;
  }
};

const getUser = (filter) => {
  return db.User.findOne({ where: filter });
};

const getUserById = (id) => {
  return db.User.findByPk(id);
};

module.exports = {
  createUser,
  getUser,
  getUserById,
};
