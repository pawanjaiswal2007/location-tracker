import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'locations.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Database Table
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT NOT NULL,
      email TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Routes

// Add or Update Location
app.post('/api/location/track', (req, res) => {
  const { phoneNumber, email, latitude, longitude, address } = req.body;

  if (!phoneNumber && !email) {
    return res.status(400).json({ error: 'Phone number or email is required' });
  }

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  db.run(
    `INSERT INTO locations (phone_number, email, latitude, longitude, address) 
     VALUES (?, ?, ?, ?, ?)`,
    [phoneNumber || '', email || '', latitude, longitude, address || ''],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save location' });
      }
      res.json({ 
        success: true, 
        message: 'Location tracked successfully',
        id: this.lastID 
      });
    }
  );
});

// Get Location by Phone Number OR Email
app.get('/api/location/get', (req, res) => {
  const { phoneNumber, email } = req.query;

  if (!phoneNumber && !email) {
    return res.status(400).json({ error: 'Phone number or email is required' });
  }

  let query = 'SELECT * FROM locations WHERE ';
  let params = [];

  if (phoneNumber && email) {
    query += '(phone_number = ? OR email = ?) ORDER BY timestamp DESC';
    params = [phoneNumber, email];
  } else if (phoneNumber) {
    query += 'phone_number = ? ORDER BY timestamp DESC';
    params = [phoneNumber];
  } else {
    query += 'email = ? ORDER BY timestamp DESC';
    params = [email];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve locations' });
    }
    res.json({ locations: rows || [] });
  });
});

// Get Latest Location by Phone Number OR Email
app.get('/api/location/latest', (req, res) => {
  const { phoneNumber, email } = req.query;

  if (!phoneNumber && !email) {
    return res.status(400).json({ error: 'Phone number or email is required' });
  }

  let query = 'SELECT * FROM locations WHERE ';
  let params = [];

  if (phoneNumber && email) {
    query += '(phone_number = ? OR email = ?) ORDER BY timestamp DESC LIMIT 1';
    params = [phoneNumber, email];
  } else if (phoneNumber) {
    query += 'phone_number = ? ORDER BY timestamp DESC LIMIT 1';
    params = [phoneNumber];
  } else {
    query += 'email = ? ORDER BY timestamp DESC LIMIT 1';
    params = [email];
  }

  db.get(query, params, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve location' });
    }
    res.json({ location: row || null });
  });
});

// Get All Users
app.get('/api/users', (req, res) => {
  db.all(
    `SELECT DISTINCT phone_number, email FROM locations ORDER BY phone_number ASC`,
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve users' });
      }
      res.json({ users: rows || [] });
    }
  );
});

// Delete Location Record
app.delete('/api/location/delete/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM locations WHERE id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete location' });
      }
      res.json({ success: true, message: 'Location deleted successfully' });
    }
  );
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
