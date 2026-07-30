const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");

test("health endpoint returns service status", async () => {
  const response = await request(app).get("/api/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("unknown endpoint returns 404", async () => {
  const response = await request(app).get("/not-real");
  assert.equal(response.status, 404);
});

