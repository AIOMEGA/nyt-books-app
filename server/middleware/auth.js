// Simple JWT based authentication middleware
const jwt = require("jsonwebtoken");
// Fallback secret makes local development easier
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = function (req, res, next) {
  // Expect header format "Authorization: Bearer <token>"
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token provided" });

  // Expect header format "Authorization: Bearer <token>"
  const token = auth.split(" ")[1];
  try {
    // Validate token and attach user id to request
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    // Token invalid or expired
    return res.status(401).json({ error: "Invalid token" });
  }
};
