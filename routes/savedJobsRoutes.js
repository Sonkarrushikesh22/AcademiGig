const router = require('express').Router();
const savedJobsController = require('../controllers/savedJobsController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/save',authMiddleware, savedJobsController.saveJob);
router.get('/get', authMiddleware,savedJobsController.getSavedJobs);
router.delete('/delete/:jobId',authMiddleware, savedJobsController.deleteSavedJob);

module.exports = router;