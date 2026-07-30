const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { Application, Job } = require("../models");
const { protect, permit } = require("../auth");
const { aiUrl, aiKey, maxFileMb } = require("../config");
const { asyncHandler, audit } = require("../utils");

const router = express.Router();
const uploadDir = path.resolve(__dirname, "../../uploads");
const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: maxFileMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => allowedTypes.has(file.mimetype) ? cb(null, true) : cb(new Error("Only PDF and DOCX resumes are accepted")),
});

router.get("/mine", protect, asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidate: req.user._id })
    .populate("job", "title company location")
    .sort({ createdAt: -1 });
  res.json({ applications });
}));

router.get("/job/:jobId", protect, permit("recruiter", "admin"), asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (req.user.role !== "admin" && String(job.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You can only view applicants for your jobs" });
  }
  const applications = await Application.find({ job: job._id })
    .populate("candidate", "name email")
    .sort({ "analysis.overallScore": -1 });
  res.json({ applications });
}));

router.post("/:jobId", protect, permit("candidate"), upload.single("resume"), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });
  const job = await Job.findOne({ _id: req.params.jobId, status: "open" });
  if (!job) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(404).json({ message: "Open job not found" });
  }
  let application;
  try {
    application = await Application.create({
      candidate: req.user._id,
      job: job._id,
      resumeOriginalName: req.file.originalname,
      resumeStoredName: req.file.filename,
      resumeMimeType: req.file.mimetype,
    });
    const fileBase64 = await fs.readFile(req.file.path, "base64");
    const response = await axios.post(`${aiUrl}/analyze`, {
      filename: req.file.originalname,
      content_base64: fileBase64,
      job_description: job.description,
      required_skills: job.requiredSkills,
      minimum_experience: job.minimumExperience,
    }, {
      headers: { "x-service-key": aiKey },
      timeout: 30000,
      maxContentLength: maxFileMb * 1024 * 1024 * 1.5,
    });
    application.extracted = response.data.extracted;
    application.analysis = response.data.analysis;
    application.status = "screened";
    await application.save();
    await audit(req, "application.screen", "Application", application._id, { job: job._id });
    res.status(201).json({ application });
  } catch (error) {
    if (!application) await fs.unlink(req.file.path).catch(() => {});
    if (error?.code === 11000) return res.status(409).json({ message: "You already applied for this job" });
    if (application) {
      application.status = "failed";
      application.error = "Resume analysis failed";
      await application.save();
    }
    throw error;
  }
}));

router.patch("/:id/status", protect, permit("recruiter", "admin"), asyncHandler(async (req, res) => {
  const allowed = ["screened", "shortlisted", "rejected", "hired"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const application = await Application.findById(req.params.id).populate("job");
  if (!application) return res.status(404).json({ message: "Application not found" });
  if (req.user.role !== "admin" && String(application.job.createdBy) !== req.user.id) {
    return res.status(403).json({ message: "You cannot update this application" });
  }
  application.status = req.body.status;
  if (req.body.recruiterNotes !== undefined) application.recruiterNotes = req.body.recruiterNotes;
  await application.save();
  await audit(req, "application.status", "Application", application._id, { status: application.status });
  res.json({ application });
}));

module.exports = router;

