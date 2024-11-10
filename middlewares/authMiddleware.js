const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get the token from the request header
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    
    // Check if token is missing
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;
