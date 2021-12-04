const Joi = require('joi');
const { phoneNumberSchema } = require('../../user/validators');

const validateSMSRequest = {
  source: 'body',
  schema: Joi.object({
    phoneNumber: phoneNumberSchema.required(),
  }),
};

const validateSMSCode = {
  source: 'body',
  schema: Joi.object({
    code: Joi.string().required(),
  }),
};

module.exports = {
  validateSMSCode,
  validateSMSRequest,
};
