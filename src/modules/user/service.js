const { doesUrlContainAnImage } = require('../../helpers/urlChecker');
const {
  EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE,
  PHONE_NUMBER_IS_NOT_UNIQUE_MESSAGE,
} = require('./constants');
const db = require('../../models');
const { ValidationError } = require('../../utils/errors');
const passwordService = require('../password/service');

const createUser = async (data) => {
  const { name, email, password, avatarUrl, phoneNumber } = data;
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
      phoneNumber,
    });

    return user;
  } catch (err) {
    if (err instanceof db.Sequelize.UniqueConstraintError) {
      if (err.fields['users.phone_number']) {
        throw new ValidationError(PHONE_NUMBER_IS_NOT_UNIQUE_MESSAGE);
      } else {
        throw new ValidationError(EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE);
      }
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
