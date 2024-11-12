const express = require('express');
const userController = require('../controllers/userController');
const fileUploadService = require('../services/fileUploadService');

const router = express.Router();

router.put(
  '/profile',
  fileUploadService.uploadSingle('profile-images'), // Upload to 'profile-images' folder
  userController.updateUserProfile
);

module.exports = router;
