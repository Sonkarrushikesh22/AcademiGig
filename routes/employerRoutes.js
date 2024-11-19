const router = require('express').Router();
const jobController = require('../controllers/employerController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/createjob',
    authMiddleware('employer'),
  jobController.createJob
);

module.exports = router;
