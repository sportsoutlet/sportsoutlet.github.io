import db from '../db.js'; // adjust the path


export default function gameSummary(team) {

    const stmt = db.prepare(`
  SELECT * FROM recaps
  WHERE teamName = ?
  ORDER BY created_at DESC
  LIMIT 1
`);

    const latestRecap = stmt.get(team); // returns an object like:


    return latestRecap;
}