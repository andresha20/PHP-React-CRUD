const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'kibrary',
  connectionLimit: 10
});

app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { firstName, lastName, email } = req.body;
  pool.query(
    'INSERT INTO users (firstName, lastName, email) VALUES (?, ?, ?)',
    [firstName, lastName, email],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'User created successfully', userId: results.insertId });
    }
  );
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;
  pool.query(
    'UPDATE users SET firstName=?, lastName=?, email=? WHERE id=?',
    [firstName, lastName, email, userId],
    (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User updated successfully' });
    }
  );
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('DELETE FROM users WHERE id=?', [userId], (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

const PORT = process.env?.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
