const request = require("supertest");
const app = require("../index");

describe("POST /api/sessions", () => {
  it("returns 400 when email and password are missing", async () => {
    const res = await request(app).post("/api/sessions").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Email and password are required");
  });

  it("returns 401 for an invalid email or password", async () => {
    const res = await request(app).post("/api/sessions").send({
      email: "invalid@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("returns 401 when the password is incorrect", async () => {
    const res = await request(app).post("/api/sessions").send({
      email: "johndoe@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid email or password");
  });

  it("authenticates a user with valid credentials", async () => {
    const res = await request(app).post("/api/sessions").send({
      email: "johndoe@gmail.com",
      password: "12345678",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Authentication successful");

    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("full_name");
    expect(res.body.user).toHaveProperty("email");
  });
});
