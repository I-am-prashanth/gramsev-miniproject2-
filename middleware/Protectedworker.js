
import jwt from "jsonwebtoken";
import Worker from "../models/wroker.model.js";

const Protectworker = async (req, res, next) => {
    try {
        // METHOD 1: Parse cookies manually from header as fallback
        let token;
        
        // First try standard cookie parser method
        if (req.cookies.jwt && req.cookies.jwt.split('.').length === 3) {
            token = req.cookies.jwt;
        }
        // If not found, parse raw cookie header
        else if (req.headers.cookie) {
            const cookies = req.headers.cookie.split('; ');
            for (const cookie of cookies) {
                if (cookie.startsWith('jwt=')) {
                    const value = cookie.split('=')[1];
                    if (value.split('.').length === 3) {
                        token = value;
                        break;
                    }
                }
            }
        }

        // console.log("Final extracted token:", token); // Debug log
        
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no valid token found" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await Worker.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error:", error.message);
        return res.status(401).json({ 
            message: "Not authorized",
            error: error.message 
        });
    }
};

export default Protectworker;