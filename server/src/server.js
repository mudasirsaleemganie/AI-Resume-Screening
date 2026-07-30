const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = require("./app");
const { mongoUri, port } = require("./config");

fs.mkdirSync(path.resolve(__dirname, "../uploads"), { recursive: true });

mongoose.connect(mongoUri)
  .then(() => app.listen(port, () => console.log(`API listening on port ${port}`)))
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });

process.on("SIGTERM", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

