const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // Save the hashed password, not the plain-text one
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(200).json({
      message: 'User has been registered successfully',
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'User Creation Failed',
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Exclude the password from the response
      const { password, ...userData } = user._doc;
  
      // Respond with user data (excluding the password)
      res.status(200).json({
        message: 'Login successful',
        data: userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Login failed',
        error: error.message,
      });
    }
  });

module.exports = router;
