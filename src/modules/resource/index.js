const express = require('express');
const validator = require('../../middlewares/validator');
const { validateResource, validateUser } = require('./validators');
const { StatusCodes } = require('http-status-codes');
const userController = require('../../controllers/userController');

const router = express.Router();

const getResource = (req, res, next) => {
  // main logic
  return res.sendResponse(StatusCodes.OK, { ...req.params, ...req.query });
};

router.get('/', validator(validateResource), getResource);
router.post('/user', validator(validateUser), userController.create);

module.exports = router;
