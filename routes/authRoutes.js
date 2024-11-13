const router = require('express').Router();
const authController = require('../controllers/authController');


// User Routes
router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);

// Employer Routes
router.post("/employer/register", authController.registerEmployer);
router.post("/employer/login", authController.loginEmployer);



module.exports = router;
