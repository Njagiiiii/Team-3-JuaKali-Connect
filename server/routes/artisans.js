const express = require("express");

const router = express.Router();

const db = require("../db");

// ========================================
// GET all artisans
// GET /api/artisans
// ========================================
router.get("/", async (req, res) => {
  try {
    const { search, location } = req.query;

    let sql = `
      SELECT id, full_name, specialty, rating
      FROM artisans
      WHERE 1 = 1
    `;

    const params = [];

    // Search by artisan name or specialty
    if (search) {
      sql += `
        AND (
          full_name LIKE ?
          OR specialty LIKE ?
        )
      `;

      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Filter by location
    if (location) {
      sql += ` AND location = ?`;
      params.push(location);
    }

    sql += ` ORDER BY id DESC`;

    const [rows] = await db.query(sql, params);

    // Contract requires 404 when no matching artisans are found
    if (rows.length === 0) {
      return res.status(404).json({
        message: "No matching artisans found",
      });
    }

    // Map database fields to OpenAPI response fields
    const artisans = rows.map((artisan) => ({
      id: artisan.id,
      name: artisan.full_name,
      service: artisan.specialty,
      rating: Number(artisan.rating),
    }));

    res.status(200).json(artisans);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch artisans",
    });
  }
});

// ========================================
// GET one artisan by ID
// GET /api/artisans/:id
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT id, full_name, specialty, phone, rating
      FROM artisans
      WHERE id = ?
      `,
      [id],
    );

    // Contract requires 404 when artisan does not exist
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Artisan not found",
      });
    }

    const artisan = rows[0];

    // Map database fields to OpenAPI response fields
    const response = {
      id: artisan.id,
      name: artisan.full_name,
      service: artisan.specialty,
      phone: artisan.phone,
      rating: Number(artisan.rating),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch artisan",
    });
  }
});

// POST a new artisan
// POST /api/artisans

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
      `
      INSERT INTO artisans
      (
        full_name,
        phone,
        location,
        years_experience,
        bio,
        specialty,
        agreed_to_code_of_conduct
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
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
