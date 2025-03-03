import jwt from "jsonwebtoken";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customerId = decoded.id; // Attach userId to the request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
