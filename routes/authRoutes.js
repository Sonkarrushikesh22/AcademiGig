const router = require('express').Router();
const authController = require('../controllers/authController');
//const authMiddleware = require('../middlewares/authMiddleware');

// User Routes
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);

// Employer Routes
router.post("/employer/register", authController.registerEmployer);
router.post("/employer/login", authController.loginEmployer);

// Admin Routes
// router.post("/admin/register", authController.registerAdmin);
// router.post("/admin/login", authController.loginAdmin);

module.exports = router;
