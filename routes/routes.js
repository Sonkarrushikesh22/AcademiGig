const router = require ('express').Router();
const authRoutes = require('./authRoutes.js');
const userRoutes = require('./userRoutes');

const base = '/api/v1';

router.use(`${base}/auth`, authRoutes);
router.use(`${base}/user`, userRoutes);

module.exports = router;

