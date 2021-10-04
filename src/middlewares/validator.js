const { ValidationError } = require('../utils/errors');

module.exports = (validationRules, options = { abortEarly: true }) => {
  return (req, res, next) => {
    if (!validationRules || !validationRules.schema || !validationRules.source) {
      return next();
    }
    const { schema, source } = validationRules;
    const data = req[source];
    const { error } = schema.validate(data, options);
    if (error) {
      return next(new ValidationError(`${error.details[0].message} in [${source}]`));
    }
    return next();
  };
};
