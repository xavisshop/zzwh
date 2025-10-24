const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all news
router.get('/', (req, res) => {
  db.query('SELECT * FROM news ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Error fetching news:', err);
      res.status(500).send('Error fetching news');
      return;
    }
    res.json(results);
  });
});

// Get news by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM news WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching news by ID:', err);
      res.status(500).send('Error fetching news by ID');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('News not found');
      return;
    }
    res.json(results[0]);
  });
});

// Add new news
router.post('/', (req, res) => {
  const { title, category, author, image, summary, content } = req.body;
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const sql = 'INSERT INTO news (title, category, author, date, image, summary, content) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, category, author, date, image, summary, content], (err, result) => {
    if (err) {
      console.error('Error adding news:', err);
      res.status(500).send('Error adding news');
      return;
    }
    res.status(201).json({ message: 'News added successfully', id: result.insertId });
  });
});

// Delete news by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM news WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting news:', err);
      res.status(500).send('Error deleting news');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('News not found');
      return;
    }
    res.json({ message: 'News deleted successfully' });
  });
});

module.exports = router;