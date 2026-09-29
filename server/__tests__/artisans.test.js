const request = require("supertest");
const app = require("../index");

describe("GET /api/artisans", () => {

  it("returns artisans successfully", async () => {
    const res = await request(app)
      .get("/api/artisans");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("name");
      expect(res.body[0]).toHaveProperty("service");
      expect(res.body[0]).toHaveProperty("rating");
    }
  });

  it("returns not found when no artisans match the search", async () => {
    const res = await request(app)
      .get("/api/artisans")
      .query({
        search: "DefinitelyNotAnArtisanThatExists999999"
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "No matching artisans found"
    );
  });

  it("handles the location query parameter", async () => {
    const res = await request(app)
      .get("/api/artisans")
      .query({
        location: "Nairobi"
      });

    expect([200, 404]).toContain(res.status);

    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    } else {
      expect(res.body).toHaveProperty("message");
    }
  });

});

describe("GET /api/artisans/:id", () => {

  it("returns an artisan successfully", async () => {
    const res = await request(app)
      .get("/api/artisans/1");

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("service");
    expect(res.body).toHaveProperty("phone");
    expect(res.body).toHaveProperty("rating");
  });

  it("returns not found for an artisan that does not exist", async () => {
    const res = await request(app)
      .get("/api/artisans/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "message",
      "Artisan not found"
    );
  });

  it("handles an invalid artisan ID", async () => {
    const res = await request(app)
      .get("/api/artisans/abc");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

});