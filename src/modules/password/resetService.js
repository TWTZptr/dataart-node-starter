const { INVALID_SMS_CODE_MESSAGE, INVALID_PHONE_NUMBER } = require('./constants');
const db = require('../../models');
const Hashids = require('hashids');
const { SMS, AUTH } = require('../../config');
const { ValidationError } = require('../../utils/errors');
const userService = require('../user/service');
const authService = require('../auth/service');
const passwordService = require('./service');
const twilio = require('../../helpers/twilio');

const hashids = new Hashids(SMS.SALT);

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

const generateSMSCode = async (userId) => {
  const code = hashids.encode(userId, Date.now());
  await db.SmsCodes.create({
    code,
    expiredAt: new Date(Date.now() + +SMS.CODE_EXPIRATION_TIME),
    userId,
  });
  return code;
};

const verifyCode = async (userCode) => {
  const [userId] = hashids.decode(userCode);
  if (!userId) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  const code = await getCode(userCode);
  if (!code || code.expiredAt < Date.now() || code.activated) {
    throw new ValidationError(INVALID_SMS_CODE_MESSAGE);
  }

  return { userId };
};

const useCode = async (res, payload) => {
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
  await deactivateCode(payload.code);
};

const deactivateCode = (code) => {
  return db.SmsCodes.update({ activated: true }, { where: { code } });
};

const getCode = (code) => {
  return db.SmsCodes.findOne({ where: { code } });
};

const changePassword = async (userId, newPassword) => {
  const hash = await passwordService.hash(newPassword);
  await userService.updateUser(userId, { password: hash });
};

module.exports = {
  verifyCode,
  sendSMSCode,
  useCode,
  changePassword,
};
