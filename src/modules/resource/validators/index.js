const Joi = require('joi');

const validateResource = {
  source: 'query',
  schema: Joi.object({
    createdAt: Joi.date(),
    format: Joi.string().valid('json', 'xml'),
  }),
};

module.exports = {
  validateResource,
};
