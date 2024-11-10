// authController.js
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// User Registration
exports.register = async (req, res) => {
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // Create a new user with the hashed password
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        
        // Save the user to the database
        await newUser.save();
        
        // Respond with success message
        res.status(200).json({
            message: 'User has been registered successfully',
            data: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'User Creation Failed',
            error: error.message
        });
    }
};

// User Login
exports.login = async (req, res) => {
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
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        
        // Exclude the password from the response
        const { password, ...userData } = user._doc;
        
        // Respond with user data and token
        res.status(200).json({
            message: 'Login successful',
            data: userData,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Login failed',
            error: error.message
        });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};