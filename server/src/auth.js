const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("./config");
const { User } = require("./models");

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
    issuer: "resume-screening-api",
  });
}

async function protect(req, res, next) {
  try {
    const value = req.headers.authorization || "";
    if (!value.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required" });
    const payload = jwt.verify(value.slice(7), jwtSecret, { issuer: "resume-screening-api" });
    const user = await User.findById(payload.sub);
    if (!user || !user.active) return res.status(401).json({ message: "Account is unavailable" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
}

function permit(...roles) {
  return (req, res, next) =>
    roles.includes(req.user.role) ? next() : res.status(403).json({ message: "Insufficient permission" });
}

module.exports = { createToken, protect, permit };

