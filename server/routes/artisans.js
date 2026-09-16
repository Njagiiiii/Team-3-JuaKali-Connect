const express = require("express");

const router = express.Router();
const db = require("../db");

// GET all artisans
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM artisans ORDER BY id DESC");

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch artisans",
    });
  }
});

// POST a new artisan
router.post("/", async (req, res) => {
  try {
    const {
      full_name,
      phone,
      location,
      years_experience,
      bio,
      specialty,
      agreed_to_code_of_conduct,
    } = req.body;

    if (
      !full_name ||
      !phone ||
      !location ||
      years_experience === undefined ||
      !bio ||
      !specialty ||
      agreed_to_code_of_conduct !== true
    ) {
      return res.status(400).json({
        error:
          "All fields are required and the code of conduct must be accepted",
      });
    }

    const [result] = await db.query(
      `INSERT INTO artisans
      (
        full_name,
        phone,
        location,
        years_experience,
        bio,
        specialty,
        agreed_to_code_of_conduct
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        phone,
        location,
        years_experience,
        bio,
        specialty,
        agreed_to_code_of_conduct,
      ],
    );

    res.status(201).json({
      message: "Artisan registered successfully",
      id: result.insertId,
      full_name,
      phone,
      location,
      years_experience,
      bio,
      specialty,
      agreed_to_code_of_conduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to register artisan",
    });
  }
});

module.exports = router;
