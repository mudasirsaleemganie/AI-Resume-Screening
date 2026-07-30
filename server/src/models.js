const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["candidate", "recruiter", "admin"], default: "candidate" },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, default: "Remote", trim: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    description: { type: String, required: true, maxlength: 12000 },
    requiredSkills: [{ type: String, trim: true, lowercase: true }],
    minimumExperience: { type: Number, min: 0, max: 50, default: 0 },
    status: { type: String, enum: ["draft", "open", "closed"], default: "open" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
jobSchema.index({ status: 1, createdAt: -1 });

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resumeOriginalName: { type: String, required: true },
    resumeStoredName: { type: String, required: true, select: false },
    resumeMimeType: { type: String, required: true },
    extracted: {
      name: String,
      email: String,
      phone: String,
      skills: [String],
      education: [String],
      experienceYears: Number,
      textPreview: String,
    },
    analysis: {
      overallScore: Number,
      skillScore: Number,
      semanticScore: Number,
      experienceScore: Number,
      matchedSkills: [String],
      missingSkills: [String],
      predictedRole: String,
      roleConfidence: Number,
      strengths: [String],
      recommendations: [String],
      modelVersion: String,
    },
    status: {
      type: String,
      enum: ["processing", "screened", "shortlisted", "rejected", "hired", "failed"],
      default: "processing",
    },
    recruiterNotes: { type: String, maxlength: 3000, default: "" },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, "analysis.overallScore": -1 });

const auditSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    metadata: mongoose.Schema.Types.Mixed,
    ip: String,
  },
  { timestamps: true }
);
auditSchema.index({ createdAt: -1 });

module.exports = {
  User: mongoose.model("User", userSchema),
  Job: mongoose.model("Job", jobSchema),
  Application: mongoose.model("Application", applicationSchema),
  Audit: mongoose.model("Audit", auditSchema),
};

