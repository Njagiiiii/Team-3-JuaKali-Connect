const request = require("supertest");
const app = require("../index");

describe("POST /api/bookings", () => {
  it("creates a booking with valid data", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        artisan_name: "Test Artisan",
        service: "Plumbing",
        status: "pending",
      });

    expect(res.status).toBe(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("artisan_name", "Test Artisan");
    expect(res.body).toHaveProperty("service", "Plumbing");
    expect(res.body).toHaveProperty("status", "pending");
  });

  it("rejects a booking when artisan_name is missing", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        service: "Plumbing",
        status: "pending",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("rejects a booking when service is missing", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        artisan_name: "Test Artisan",
        status: "pending",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("rejects a booking when artisan_name is not a string", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        artisan_name: 123,
        service: "Plumbing",
        status: "pending",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("rejects a booking with an invalid status", async () => {
    const res = await request(app)
      .post("/api/bookings")
      .send({
        artisan_name: "Test Artisan",
        service: "Plumbing",
        status: "invalid",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
});