const express = require('express');
const os = require('os');

function createApp(pool) {
  const app = express();
  app.use(express.json());

  // info container (untuk melihat load balancing)
  app.get('/api/info', (req, res) => res.json({ status: 'ok', host: os.hostname() }));

  app.get('/api/todos', async (req, res) => {
    try {
      const r = await pool.query('SELECT id, title, done FROM todos ORDER BY id');
      res.json(r.rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.post('/api/todos', async (req, res) => {
    const title = (req.body.title || '').trim();
    if (!title) return res.status(400).json({ error: 'title wajib diisi' });
    try {
      const r = await pool.query('INSERT INTO todos (title) VALUES ($1) RETURNING id, title, done', [title]);
      res.status(201).json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.put('/api/todos/:id', async (req, res) => {
    try {
      const r = await pool.query('UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, title, done', [!!req.body.done, req.params.id]);
      if (!r.rows.length) return res.status(404).json({ error: 'tidak ditemukan' });
      res.json(r.rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  app.delete('/api/todos/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
      res.status(204).end();
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  return app;
}

module.exports = { createApp };
