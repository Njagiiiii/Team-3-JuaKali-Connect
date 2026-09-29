const request = require("supertest");
const app = require("../index");

describe("PATCH /api/bookings/:id", () => {

  it("updates a booking with valid data", async () => {
    const res = await request(app)
      .patch("/api/bookings/1")
      .send({
        status: "confirmed",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking updated");
  });

  it("rejects a booking update when status is missing", async () => {
    const res = await request(app)
      .patch("/api/bookings/1")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("rejects a booking update with an invalid status", async () => {
    const res = await request(app)
      .patch("/api/bookings/1")
      .send({
        status: "invalid",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("rejects an invalid booking ID", async () => {
    const res = await request(app)
      .patch("/api/bookings/abc")
      .send({
        status: "confirmed",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "id must be a positive integer"
    );
  });

  it("returns not found for a booking that does not exist", async () => {
    const res = await request(app)
      .patch("/api/bookings/999999")
      .send({
        status: "confirmed",
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Booking not found");
  });

});