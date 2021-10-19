const express = require('express');
const validator = require('../../middlewares/validator');
const { validateUser } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const { EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE } = require('./constants');
const { ValidationError } = require('../../utils/errors');
const db = require('../../models');
const { Sequelize } = require('../../models');

const router = express.Router();

const createUser = async (req, res, next) => {
  try {
    const { name, email, avatarUrl } = req.body;
    const item = await db.User.create({
      name,
      email,
      avatar_url: avatarUrl,
    });

    res.sendResponse(StatusCodes.OK, item);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      next(new ValidationError(EMAIL_IS_NOT_UNIQUE_ERROR_MESSAGE));
    }

    next(err);
  }
};

router.post('/', validator(validateUser), createUser);

module.exports = router;
