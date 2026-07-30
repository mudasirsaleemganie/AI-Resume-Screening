const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { User } = require("../models");
const { createToken, protect } = require("../auth");
const { asyncHandler, audit, publicUser } = require("../utils");

const router = express.Router();

router.post("/register", asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !validator.isEmail(email || "") || typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Provide a name, valid email and password of at least 8 characters" });
  }
  if (await User.exists({ email: email.toLowerCase() })) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    role: "candidate",
  });
  res.status(201).json({ token: createToken(user), user: publicUser(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email || "").toLowerCase() }).select("+passwordHash");
  if (!user || !user.active || !(await bcrypt.compare(req.body.password || "", user.passwordHash))) {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
  user.lastLoginAt = new Date();
  await user.save();
  req.user = user;
  await audit(req, "auth.login", "User", user._id);
  res.json({ token: createToken(user), user: publicUser(user) });
}));

router.get("/me", protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
