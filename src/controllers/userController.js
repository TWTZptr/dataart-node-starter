const db = require('../models');
const { StatusCodes } = require('http-status-codes');
const { ValidationError } = require('../utils/errors');
const { EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE } = require('../modules/resource/constants');

class UserControlller {
  async create(req, res, next) {
    try {
      const { name, email, avatarUrl } = req.body;
      const item = await db.User.create({
        name,
        email,
        avatar_url: avatarUrl,
      });

      res.sendResponse(StatusCodes.OK, item);
    } catch (err) {
      if (err.errors[0].message === EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE) {
        next(new ValidationError('User with that email already exists'));
      }

      next(err);
    }
  }
}

module.exports = new UserControlller();
