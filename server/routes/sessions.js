const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/sessions
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check that both fields were provided
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find the user by email
    const [rows] = await db.query(
      "SELECT id, full_name, email, password FROM users WHERE email = ?",
      [email],
    );

    // User does not exist
    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = rows[0];

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Successful authentication
    res.status(201).json({
      message: "Authentication successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to authenticate user",
    });
  }
});

module.exports = router;
