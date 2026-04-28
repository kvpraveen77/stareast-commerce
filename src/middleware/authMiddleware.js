const tokenService = require("../services/tokenService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "missing or invalid token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = tokenService.verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
}

module.exports = authMiddleware;
