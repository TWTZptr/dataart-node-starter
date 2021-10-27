const express = require('express');
const validator = require('../../middlewares/validator');
const { validateUser } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const userService = require('./service');

const router = express.Router();

const createUser = async (req, res, next) => {
  try {
    const { name, email, avatarUrl, password } = req.body;
    const user = await userService.createUser(name, email, password, avatarUrl);
    return res.sendResponse(StatusCodes.OK, user);
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateUser), createUser);

module.exports = router;
