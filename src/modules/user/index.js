const express = require('express');
const validator = require('../../middlewares/validator');
const { validateUser } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const { EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE } = require('./constants');
const { ValidationError } = require('../../utils/errors');
const db = require('../../models');
const checkUrl = require('./urlChecker');

const router = express.Router();

const createUser = async (req, res, next) => {
  try {
    const { name, email, avatarUrl } = req.body;

    if (avatarUrl)
      // avatar url is not required
      await checkUrl(avatarUrl);

    const item = await db.User.create({
      name,
      email,
      avatar_url: avatarUrl,
    });

    return res.sendResponse(StatusCodes.OK, item);
  } catch (err) {
    if (err instanceof db.Sequelize.UniqueConstraintError) {
      return next(new ValidationError(EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE));
    }

    return next(err);
  }
};

router.post('/', validator(validateUser), createUser);

module.exports = router;
