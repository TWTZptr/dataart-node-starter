const express = require('express');
const validator = require('../../middlewares/validator');
const { validateUser } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const userService = require('./service');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.sendResponse(StatusCodes.OK, user);
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateUser), createUser);

router.get('/me', authMiddleware, (req, res, next) =>
  res.sendResponse(StatusCodes.OK, req.user),
);

module.exports = router;
