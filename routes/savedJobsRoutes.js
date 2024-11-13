const router = require('express').Router();
const savedJobsController = require('../controllers/savedJobsController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/save',authMiddleware('user'), savedJobsController.saveJob);
router.get('/get', authMiddleware('user'),savedJobsController.getSavedJobs);
router.delete('/delete/:jobId',authMiddleware('user'), savedJobsController.deleteSavedJob);

module.exports = router;