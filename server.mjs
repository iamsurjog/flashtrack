import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v7 as uuidv7 } from 'uuid';


const app = express();
const db = new Database('data.db');

function safeJsonParse(value) {
    if (typeof value !== 'string' || value === '') return {};
    try {
        return JSON.parse(value);
    } catch {
        return { raw_text: value };
    }
}

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

// Dashboard data endpoint: returns all sessions with their events, info parsed from JSON.
// Optional ?limit=N caps the number of most recent events returned (default 10000).
app.get('/api/data', (req, res) => {
    const limit = Math.max(1, Math.min(100000, parseInt(req.query.limit, 10) || 10000));

    try {
        const sessions = db.prepare('SELECT id, info FROM sessions ORDER BY id ASC').all()
            .map(s => ({ id: s.id, info: safeJsonParse(s.info) }));

        const events = db.prepare(`
      SELECT rowid AS rowId, sessionId, type, info
      FROM watchData
      ORDER BY rowid DESC
      LIMIT ?
    `).all(limit)
            .map(e => ({ ...e, info: safeJsonParse(e.info) }))
            .reverse(); // back to chronological order

        res.json({ sessions, events });
    } catch (err) {
        console.error('Failed to read tracker data:', err);
        res.status(500).json({ error: 'Database read failed' });
    }
});

// Serve static files (index.html, dashboard.html, tracker.js) so the whole
// app can run from http://localhost:3001 without a separate dev server.
app.use(express.static('.'));

app.listen(3001, () => {
    console.log('Express tracker running on http://localhost:3001');
});

