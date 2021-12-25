const express = require('express');
const fileService = require('./service');
const authMiddleware = require('../../middlewares/auth');
const { StatusCodes } = require('http-status-codes');

const router = express.Router({ mergeParams: true });

const uploadFiles = async (req, res, next) => {
  try {
    const file = await fileService.uploadFile(req.user.id, req);
    return res.sendResponse(StatusCodes.OK, file);
  } catch (err) {
    return next(err);
  }
};

const getFilesByUserId = async (req, res, next) => {
  try {
    const links = await fileService.findUserFiles(req.user.id);
    return res.sendResponse(StatusCodes.OK, { links });
  } catch (err) {
    return next(err);
  }
};

router.post('/', authMiddleware.access, uploadFiles);
router.get('/', authMiddleware.access, getFilesByUserId);

module.exports = router;
