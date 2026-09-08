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

   module.exports = router;