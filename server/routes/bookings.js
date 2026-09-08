   const express = require('express');
   const router = express.Router();
   const db = require('../db');

   // GET all bookings
   router.get('/', async (req, res) => {
     try {
       const [rows] = await db.query('SELECT * FROM bookings');
       res.json(rows);
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Failed to fetch bookings' });
     }
   });
   router.post('/', async (req, res) => {
  try {
    const { artisan_name, service, status } = req.body;
    const [result] = await db.query(
      'INSERT INTO bookings (artisan_name, service, status) VALUES (?, ?, ?)',
      [artisan_name, service, status]
    );
    res.status(201).json({ id: result.insertId, artisan_name, service, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PATCH - update an existing booking
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Booking updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

   module.exports = router;