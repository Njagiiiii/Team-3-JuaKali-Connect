const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/v2/artisans
// Returns artisans inside a data object with a result count.
router.get("/", async (req, res) => {
  try {
    const { search, location } = req.query;

    let sql = `
      SELECT id, full_name, specialty, rating
      FROM artisans
      WHERE 1 = 1
    `;

    const params = [];

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

    if (location) {
      sql += " AND location = ?";
      params.push(location);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, params);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No matching artisans found",
      });
    }

    const artisans = rows.map((artisan) => ({
      id: artisan.id,
      name: artisan.full_name,
      service: artisan.specialty,
      rating: Number(artisan.rating),
    }));

    return res.status(200).json({
      data: artisans,
      count: artisans.length,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch artisans",
    });
  }
});

module.exports = router;
