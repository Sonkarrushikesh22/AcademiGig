const User = require("../models/User");
const Employer = require("../models/Employer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration
exports.registerUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "User registration failed", error: error.message });
    }
};

exports.registerEmployer = async (req, res) => {
    try {
        const { email, password, name, companyName, phone, website } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new Employer document
        const newEmployer = new Employer({
            name,
            email,
            password: hashedPassword,
            phone,
            website,
        });

        // Save the new employer to the database
        await newEmployer.save();

        res.status(201).json({ message: "Employer registered successfully", data: newEmployer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Employer registration failed", error: error.message });
    }
};



// User Login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// Employer Login
exports.loginEmployer = async (req, res) => {
    try {
        const { email, password } = req.body;
        const employer = await Employer.findOne({ email });

        if (!employer) return res.status(404).json({ message: "Employer not found" });

        const isPasswordValid = await bcrypt.compare(password, employer.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: employer._id, role: "employer" }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};