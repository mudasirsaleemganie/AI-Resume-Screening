const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { mongoUri } = require("./config");
const { User, Job } = require("./models");

async function seed() {
  await mongoose.connect(mongoUri);
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const admin = await User.findOneAndUpdate(
    { email: "admin@example.com" },
    { name: "System Admin", email: "admin@example.com", passwordHash, role: "admin", active: true },
    { upsert: true, new: true }
  );
  const recruiter = await User.findOneAndUpdate(
    { email: "recruiter@example.com" },
    { name: "Demo Recruiter", email: "recruiter@example.com", passwordHash, role: "recruiter", active: true },
    { upsert: true, new: true }
  );
  await Job.deleteMany({ company: "DemoTech" });
  await Job.create([
    {
      title: "MERN Stack Developer", company: "DemoTech", location: "Srinagar / Hybrid",
      description: "Build secure responsive applications using React, Node.js, Express, MongoDB, REST APIs, Git, Docker and automated testing.",
      requiredSkills: ["react", "javascript", "node.js", "express", "mongodb", "rest api", "git"],
      minimumExperience: 1, createdBy: recruiter._id,
    },
    {
      title: "Junior Data Scientist", company: "DemoTech", location: "Remote",
      description: "Analyze datasets and build machine learning solutions with Python, pandas, NumPy, scikit-learn, SQL and data visualization.",
      requiredSkills: ["python", "pandas", "numpy", "scikit-learn", "sql", "machine learning"],
      minimumExperience: 0, createdBy: recruiter._id,
    },
  ]);
  console.log(`Seeded admin ${admin.email}, recruiter ${recruiter.email}; password: Admin@12345`);
  await mongoose.disconnect();
}

seed().catch((error) => { console.error(error); process.exit(1); });

