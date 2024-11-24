const router = require('express').Router();
const jobController = require('../controllers/jobController');

router.get('/get-all-jobs', jobController.getAllJobs);
router.get('/get-job-details/:id', jobController.getJobDetails );
router.get('/logo-download-url', jobController.getDownloadPresignedUrl);


module.exports = router;