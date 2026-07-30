const express = require("express");
const { User, Job, Application, Audit } = require("../models");
const { protect, permit } = require("../auth");
const { asyncHandler, audit } = require("../utils");

const router = express.Router();
router.use(protect, permit("admin"));

router.get("/analytics", asyncHandler(async (_req, res) => {
  const [users, jobs, applications, statusBreakdown, topRoles, monthly] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Application.aggregate([
      { $match: { "analysis.predictedRole": { $exists: true } } },
      { $group: { _id: "$analysis.predictedRole", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    Application.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 }, avgScore: { $avg: "$analysis.overallScore" } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]),
  ]);
  res.json({ totals: { users, jobs, applications }, statusBreakdown, topRoles, monthly });
}));

router.get("/users", asyncHandler(async (_req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json({ users });
}));

router.patch("/users/:id", asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (["candidate", "recruiter", "admin"].includes(req.body.role)) user.role = req.body.role;
  if (typeof req.body.active === "boolean") user.active = req.body.active;
  await user.save();
  await audit(req, "user.update", "User", user._id, { role: user.role, active: user.active });
  res.json({ user });
}));

router.get("/audit", asyncHandler(async (_req, res) => {
  const entries = await Audit.find().populate("actor", "name email").limit(100).sort({ createdAt: -1 });
  res.json({ entries });
}));

module.exports = router;

