const router = require('express').Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Corrected route definition
router.post('/apply',
  authMiddleware('user'), 
  applicationController.applyToJob
);

router.get('/get-applications-by-user/:userId', 
  authMiddleware('user'), 
  applicationController.getApplicationsByUser
);

router.get('/get-applications-by-job/:jobId', 
  authMiddleware('employer'), 
  applicationController.getApplicationsByJob
);

module.exports = router;
