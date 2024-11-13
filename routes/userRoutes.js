const express = require('express');
const userController = require('../controllers/userController');
const fileUploadService = require('../services/fileUploadService');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

router.put(
  '/updateuserprofile',
  authMiddleware,
  fileUploadService.uploadSingle('profile-images'), // Upload to 'profile-images' folder
  userController.updateUserProfile
);

module.exports = router;
