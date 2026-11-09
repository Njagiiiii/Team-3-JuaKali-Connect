const request = require("supertest");
const app = require("../index");

const apiKey = process.env.TEAM_TEST_API_KEY;

describe("Week 13 - Backward Compatibility", () => {
  it("original endpoint and v1 return identical response data", async () => {
    const original = await request(app)
      .get("/api/artisans")
      .set("X-API-Key", apiKey);

    const v1 = await request(app)
      .get("/api/v1/artisans")
      .set("X-API-Key", apiKey);

    expect(original.status).toBe(v1.status);
    expect(original.body).toEqual(v1.body);
    expect(Array.isArray(original.body)).toBe(true);
  });
});
