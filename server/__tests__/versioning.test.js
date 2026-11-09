const request = require("supertest");
const app = require("../index");

const apiKey = process.env.TEAM_TEST_API_KEY;

describe("Week 13 - API Versioning", () => {
  it("v1 returns the original bare array response", async () => {
    const res = await request(app)
      .get("/api/v1/artisans")
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("v1 includes the correct deprecation headers", async () => {
    const res = await request(app)
      .get("/api/v1/artisans")
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(200);
    expect(res.headers.deprecation).toBe("true");
    expect(res.headers.sunset).toBe("Tue, 24 Nov 2026 00:00:00 GMT");
    expect(res.headers.link).toContain("/api/v2/artisans");
  });

  it("old unversioned endpoint still returns an array with deprecation headers", async () => {
    const res = await request(app)
      .get("/api/artisans")
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.headers.deprecation).toBe("true");
    expect(res.headers.sunset).toBe("Tue, 24 Nov 2026 00:00:00 GMT");
    expect(res.headers.link).toContain("/api/v2/artisans");
  });

  it("v2 returns an object containing data and count", async () => {
    const res = await request(app)
      .get("/api/v2/artisans")
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(res.body.data.length);
  });

  it("v2 does not include deprecation headers", async () => {
    const res = await request(app)
      .get("/api/v2/artisans")
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(200);
    expect(res.headers.deprecation).toBeUndefined();
    expect(res.headers.sunset).toBeUndefined();
    expect(res.headers.link).toBeUndefined();
  });

  it("v2 preserves the search filter", async () => {
    const res = await request(app)
      .get("/api/v2/artisans")
      .query({ search: "DefinitelyNotAnArtisanThatExists999999" })
      .set("X-API-Key", apiKey);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("No matching artisans found");
  });

  it("v2 requires API-key authentication", async () => {
    const res = await request(app)
      .get("/api/v2/artisans");

    expect(res.status).toBe(401);
  });
});
