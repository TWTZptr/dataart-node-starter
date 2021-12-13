const { INVALID_SMS_CODE_MESSAGE, INVALID_PHONE_NUMBER } = require('./constants');
const db = require('../../models');
const Hashids = require('hashids');
const { SMS, AUTH } = require('../../config');
const { ValidationError } = require('../../utils/errors');
const userService = require('../user/service');
const authService = require('../auth/service');
const { sendSMS } = require('../../helpers/twilio');
const { Op } = require('sequelize');
const { DateTime } = require('luxon');

const hashids = new Hashids(SMS.SALT);

const verifySMSCode = async (userCode) => {
  const [id] = hashids.decode(userCode);
  if (!id) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  const code = await getActiveSMSCode(userCode);

  if (!code) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  return { id };
};

const getActiveSMSCode = (code) => {
  return getSMSCode({
    [Op.and]: [{ code }, { activated: false }, { expiredAt: { [Op.gt]: Date.now() } }],
  });
};

const generateSMSCode = async (id) => {
  return hashids.encode(id, Date.now());
};

const sendSMSCode = async (phoneNumber) => {
  const user = await userService.getUser(
    { phone_number: phoneNumber },
    { exclude: ['password'] },
  );

  if (!user) {
    throw new ValidationError(INVALID_PHONE_NUMBER);
  }

  const code = await generateSMSCode(user.id);

  let transaction;

  try {
    transaction = await db.sequelize.transaction();
    await createSMSCode({ code, id: user.id }, { transaction });
    await sendSMS(phoneNumber, `Password restore code: ${code}`);
    await transaction.commit();
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }

    throw err;
  }
};

const createSMSCode = ({ code, id }, options) => {
  return db.SmsCodes.create(
    {
      code,
      expiredAt: DateTime.now().plus({ milliseconds: SMS.CODE_EXPIRATION_TIME }),
      userId: id,
    },
    options,
  );
};

const deactivateSMSCode = (code) => {
  return db.SmsCodes.update({ activated: true }, { where: { code } });
};

const getSMSCode = (filter) => {
  return db.SmsCodes.findOne({ where: filter });
};

const useSMSCode = async (res, payload) => {
  const token = authService.generateToken(
    { id: payload.id },
    AUTH.RESTORE_PASSWORD_TOKEN_SECRET,
    {
      expiresIn: AUTH.RESTORE_PASSWORD_TOKEN_EXPIRATION_TIME,
    },
  );
  await res.cookie('restorePasswordToken', token, {
    httpOnly: true,
    maxAge: AUTH.RESTORE_PASSWORD_TOKEN_EXPIRATION_TIME,
  });
  await deactivateSMSCode(payload.code);
};

module.exports = {
  verifySMSCode,
  useSMSCode,
  deactivateSMSCode,
  getSMSCode,
  sendSMSCode,
};
