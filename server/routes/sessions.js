const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const [rows] = await db.query(
      "SELECT id, full_name, email, password FROM users WHERE email = ?",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    return res.status(201).json({
      message: "Authentication successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to authenticate user",
    });
  }
});

module.exports = router;
