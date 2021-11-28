const express = require('express');
const validator = require('../../middlewares/validator');
const { validateUser, validateUserUpdate } = require('./validators');
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

const getUser = (req, res, next) => {
  return res.sendResponse(StatusCodes.OK, req.user);
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    return res.sendResponse(StatusCodes.OK, user);
  } catch (err) {
    return next(err);
  }
};

router.post('/', validator(validateUser), createUser);
router.get('/me', authMiddleware.access, getUser);
router.patch('/me', authMiddleware.access, validator(validateUserUpdate), updateUser);

module.exports = router;
