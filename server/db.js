import Database from 'better-sqlite3';
const db = new Database('recaps.db'); // or './data/recaps.db'

db.exec(`
  CREATE TABLE IF NOT EXISTS recaps (
  id TEXT PRIMARY KEY,
  fileName TEXT,
  title TEXT,
  teamName TEXT,
  date TEXT,
  time TEXT,
  venue TEXT,
  sport TEXT,
  league TEXT,
  season TEXT,
  altEventId TEXT,
  teamId TEXT,
  leagueId TEXT,
  homeTeamId TEXT,
  awayTeamId TEXT,
  homeTeam TEXT,
  awayTeam TEXT,
  homeScore INTEGER,
  awayScore INTEGER,
  videoUrl TEXT,
  teamBadge TEXT,
  homeTeamBadge TEXT,
  awayTeamBadge TEXT,
  leagueBadge TEXT,
  thumbnail TEXT,
  poster TEXT,
  finished BOOLEAN,
  summary TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;
