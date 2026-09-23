const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { artisan_name, service, status } = req.body;

    // Validation
    if (!artisan_name || !service) {
      return res.status(400).json({
        message: "artisan_name and service are required",
      });
    }

    if (typeof artisan_name !== "string" || typeof service !== "string") {
      return res.status(400).json({
        message: "artisan_name and service must be strings",
      });
    }

    if (
      status !== undefined &&
      !["pending", "confirmed", "completed"].includes(status)
    ) {
      return res.status(400).json({
        message: "status must be pending, confirmed, or completed",
      });
    }

    // Write to database only AFTER validation passes
    const finalStatus = status || "pending";

    const [result] = await db.query(
      "INSERT INTO bookings (artisan_name, service, status) VALUES (?, ?, ?)",
      [artisan_name, service, finalStatus],
    );

    // Return newly created resource
    res.status(201).json({
      id: result.insertId,
      artisan_name,
      service,
      status: finalStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create booking",
    });
  }
});

// PATCH - update an existing booking

router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "id must be a positive integer",
      });
    }

    // Validate status
    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    if (
      typeof status !== "string" ||
      !["pending", "confirmed", "completed"].includes(status)
    ) {
      return res.status(400).json({
        message: "status must be pending, confirmed, or completed",
      });
    }

    // Check that the booking exists BEFORE updating
    const [rows] = await db.query("SELECT * FROM bookings WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Update only after validation and existence check
    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

    res.status(200).json({
      message: "Booking updated",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update booking",
    });
  }
});

module.exports = router;
