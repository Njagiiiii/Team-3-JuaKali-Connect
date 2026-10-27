const request = require("supertest");
const app = require("../index");

describe("Week 9 API-key authentication", () => {
  it("rejects requests without an API key", async () => {
    const res = await request(app).get("/api/artisans");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing or invalid API key");
  });

  it("rejects requests with an invalid API key", async () => {
    const res = await request(app)
      .get("/api/artisans")
      .set("X-API-Key", "definitely-wrong-key");
    expect(res.status).toBe(401);
  });

  it("accepts the Team 3 API key", async () => {
    const res = await request(app)
      .get("/api/artisans")
      .set("X-API-Key", process.env.TEAM_TEST_API_KEY);
    expect([200, 404]).toContain(res.status);
  });
});
