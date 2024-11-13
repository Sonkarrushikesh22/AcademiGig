const jwt = require("jsonwebtoken");

// Auth middleware with role-based access control
const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
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

            // Role-based access control
            if (requiredRole && req.user.role !== requiredRole) {
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }

            next(); // Proceed to the next middleware/controller
        } catch (error) {
            res.status(401).json({ message: "Invalid token." });
        }
    };
};

module.exports = authMiddleware;
