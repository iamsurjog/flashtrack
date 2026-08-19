import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v7 as uuidv7 } from 'uuid';


const app = express();
const db = new Database('data.db');

const initEvent = db.prepare('INSERT INTO sessions (id, info) VALUES (?, ?)');
const watchChange = db.prepare('INSERT INTO watchData (sessionid, type, info) VALUES (?, ?, ?)');

app.use(cors());
app.use(express.json());

app.post('/init', (req, res) => {
    const id = uuidv7();
    initEvent.run(id, JSON.stringify(req.body));
    res.json({ id: id });
});

app.post('/track', (req, res) => {
  const { sessionId, type, ...rest } = req.body;

  // Store remaining event fields inside the 'info' column as a JSON string
  const infoString = JSON.stringify(rest);

  try {
    watchChange.run(sessionId, type, infoString);
    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to insert watch data:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

app.listen(3001, () => {
    console.log('Express tracker running on http://localhost:3001');
});

