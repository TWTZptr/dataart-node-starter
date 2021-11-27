const { doesUrlContainAnImage } = require('../../helpers/urlChecker');
const {
  ALLOWED_PHONE_NUMBER_COUNTRY_CODE,
  PHONE_NUMBER_IS_INVALID_MESSAGE,
  NOT_UNIQUE_MESSAGE,
} = require('./constants');
const db = require('../../models');
const { ConflictError } = require('../../utils/errors');
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
      const fieldName = db.User.options.classMethods.getFieldName(err.fields);
      throw new ConflictError(`${fieldName} ${NOT_UNIQUE_MESSAGE}`);
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

const validatePhoneNumber = (value, helpers) => {
  const condition = value.match(
    `^\\+(${ALLOWED_PHONE_NUMBER_COUNTRY_CODE.join('|')})[0-9]{6,10}$`,
  );
  return condition ? value : helpers.message(PHONE_NUMBER_IS_INVALID_MESSAGE);
};

const updateUser = async (id, newData) => {
  try {
    await db.User.update({ ...newData }, { where: { id } });
    const newUser = await getUserById(id);
    newUser.password = undefined;
    return newUser;
  } catch (err) {
    if (err instanceof db.Sequelize.UniqueConstraintError) {
      const fieldName = db.User.options.classMethods.getFieldName(err.fields);
      throw new ConflictError(`${fieldName} ${NOT_UNIQUE_MESSAGE}`);
    }
    throw err;
  }
};
module.exports = {
  createUser,
  getUser,
  getUserById,
  validatePhoneNumber,
  updateUser,
};
