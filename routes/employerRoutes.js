const router = require('express').Router();
const employerController = require('../controllers/employerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/createjob',
    authMiddleware('employer'),
  employerController.createJob
);

router.get('/job-logo-upload-url', authMiddleware('employer'), employerController.getUploadPresignedUrl);

module.exports = router;
