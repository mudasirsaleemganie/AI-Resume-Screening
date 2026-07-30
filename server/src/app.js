const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { clientUrl } = require("./config");
const { protect } = require("./auth");

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: clientUrl.split(",").map((x) => x.trim()), credentials: false }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(morgan("combined"));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }), require("./routes/authRoutes"));
app.use("/api/jobs", (req, res, next) => {
  if (req.headers.authorization) return protect(req, res, next);
  next();
}, require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "api" }));
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err instanceof require("multer").MulterError) return res.status(400).json({ message: err.message });
  if (err.message?.includes("Only PDF")) return res.status(400).json({ message: err.message });
  if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
  res.status(500).json({ message: "The server could not complete this request" });
});

module.exports = app;

