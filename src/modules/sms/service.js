const { INVALID_SMS_CODE_MESSAGE, INVALID_PHONE_NUMBER } = require('./constants');
const db = require('../../models');
const Hashids = require('hashids');
const { SMS, AUTH } = require('../../config');
const { ValidationError } = require('../../utils/errors');
const userService = require('../user/service');
const authService = require('../auth/service');
const twilio = require('../../helpers/twilio');

const hashids = new Hashids(SMS.SALT);

const verifySMSCode = async (userCode) => {
  const [userId] = hashids.decode(userCode);
  if (!userId) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  const code = await getSMSCode(userCode);
  if (!code || code.expiredAt < Date.now() || code.activated) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  return { userId };
};

const generateSMSCode = async (userId) => {
  const code = hashids.encode(userId, Date.now());
  await db.SmsCodes.create({
    code,
    expiredAt: new Date(Date.now() + +SMS.CODE_EXPIRATION_TIME),
    userId,
  });
  return code;
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
  await twilio.sendSMS(phoneNumber, `Password restore code: ${code}`);
};

const deactivateSMSCode = (code) => {
  return db.SmsCodes.update({ activated: true }, { where: { code } });
};

const getSMSCode = (code) => {
  return db.SmsCodes.findOne({ where: { code } });
};

const useSMSCode = async (res, payload) => {
  const token = authService.generateToken(
    { userId: payload.userId },
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
