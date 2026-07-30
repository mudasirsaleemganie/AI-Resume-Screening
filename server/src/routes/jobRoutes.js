const express = require("express");
const { Job } = require("../models");
const { protect, permit } = require("../auth");
const { asyncHandler, audit } = require("../utils");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
  const filter = req.user && ["admin", "recruiter"].includes(req.user.role) ? {} : { status: "open" };
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate("createdBy", "name");
  res.json({ jobs });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate("createdBy", "name");
  if (!job || (job.status !== "open" && !["admin", "recruiter"].includes(req.user?.role))) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json({ job });
}));

router.post("/", protect, permit("recruiter", "admin"), asyncHandler(async (req, res) => {
  const allowed = ["title", "company", "location", "employmentType", "description", "requiredSkills", "minimumExperience", "status"];
  const data = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  if (typeof data.requiredSkills === "string") data.requiredSkills = data.requiredSkills.split(",").map((x) => x.trim()).filter(Boolean);
  const job = await Job.create({ ...data, createdBy: req.user._id });
  await audit(req, "job.create", "Job", job._id);
  res.status(201).json({ job });
}));

router.patch("/:id", protect, permit("recruiter", "admin"), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (req.user.role !== "admin" && String(job.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You can only update your jobs" });
  }
  const allowed = ["title", "company", "location", "employmentType", "description", "requiredSkills", "minimumExperience", "status"];
  for (const key of allowed) if (req.body[key] !== undefined) job[key] = req.body[key];
  await job.save();
  await audit(req, "job.update", "Job", job._id);
  res.json({ job });
}));

module.exports = router;

