const router = require ('express').Router();
const authRoutes = require('./authRoutes.js');
const employerRoutes = require('./employerRoutes.js');
const userRoutes = require('./userRoutes');
const savedJobsRoutes = require('./savedJobsRoutes');

const base = '/api/v1';

router.use(`${base}/auth`, authRoutes);
router.use(`${base}/user`, userRoutes);
router.use(`${base}/employer`, employerRoutes);
router.use(`${base}/saved-jobs`, savedJobsRoutes);

module.exports = router;

