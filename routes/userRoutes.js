const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an authentication middleware

// Route to update user profile
router.put('/updateprofile', authMiddleware('user'), userController.updateUserProfile);

// Route to get presigned URL for uploading files
router.get('/get-upload-presigned-url', authMiddleware('user'), userController.getUploadPresignedUrl);

//Route to get presigned URL for downloading files
router.get('/get-download-url', authMiddleware('user'), userController.getDownloadPresignedUrl);

// Route to get user profile
router.get('/getprofile', authMiddleware('user'), userController.getProfile);

// Route to delete user profile
router.delete('/deleteprofile', authMiddleware('user'), userController.deleteProfile);

module.exports = router;
