import db from '../db.js'; // adjust the path


export default function latestRecaps() {
  const stmt = db.prepare(`
    SELECT * FROM recaps
    ORDER BY created_at DESC
    LIMIT 400
  `);

  const recaps = stmt.all(); // returns an array of recap objects
  return recaps;
}