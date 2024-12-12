const router = require('express').Router();
const jobController = require('../controllers/jobController');

router.get('/get-all-jobs', jobController.getAllJobs);
// router.get('/get-job-details/:id', jobController.getJobDetails );
router.get('/logo-download-url', jobController.getDownloadPresignedUrl);
router.get('/get-job-by-category', jobController.getJobsByCategory);
router.get('/filter-jobs', jobController.filterJobs);
router.get('/filter-options', jobController.getFilterOptions);
router.get ('/get-job-in-radius', jobController.getJobsInRadius);

module.exports = router;