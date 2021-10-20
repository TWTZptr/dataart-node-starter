const express = require('express');
const validator = require('../../middlewares/validator');
const { validateResource } = require('./validators');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();

const getResource = (req, res, next) => {
  // main logic
  return res.sendResponse(StatusCodes.OK, { ...req.params, ...req.query });
};

router.get('/', validator(validateResource), getResource);

module.exports = router;
