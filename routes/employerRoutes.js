const router = require('express').Router();
const jobController = require('../controllers/employerController');
const fileUploadService = require('../services/fileUploadService');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/createjob',
    authMiddleware,
  fileUploadService.uploadSingle('company-logo'), // Upload to 'company-logos' folder
  jobController.createJob
);

module.exports = router;
