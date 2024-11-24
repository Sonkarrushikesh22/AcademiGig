const router = require('express').Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/apply',
  authMiddleware('user'), 
  applicationController.applyToJob
);

// Updated route without userId parameter
router.get('/applied-jobs', 
  authMiddleware('user'), 
  applicationController.getAppliedJobs 
);

router.get('/get-applications-by-job/:jobId', 
  authMiddleware('employer'), 
  applicationController.getApplicationsByJob
);

module.exports = router;