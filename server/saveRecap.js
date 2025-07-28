import db from './db.js';

export function saveRecap(result) {
  const insert = db.prepare(`
  INSERT OR REPLACE INTO recaps (
    id,
    fileName,
    title,
    teamName,
    date,
    time,
    venue,
    sport,
    league,
    season,
    altEventId,
    teamId,
    leagueId,
    homeTeamId,
    awayTeamId,
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    videoUrl,
    teamBadge,
    homeTeamBadge,
    awayTeamBadge,
    leagueBadge,
    thumbnail,
    poster,
    finished,
    summary
  ) VALUES (
    @id,
    @fileName,
    @title,
    @teamName,
    @date,
    @time,
    @venue,
    @sport,
    @league,
    @season,
    @altEventId,
    @teamId,
    @leagueId,
    @homeTeamId,
    @awayTeamId,
    @homeTeam,
    @awayTeam,
    @homeScore,
    @awayScore,
    @videoUrl,
    @teamBadge,
    @homeTeamBadge,
    @awayTeamBadge,
    @leagueBadge,
    @thumbnail,
    @poster,
    @finished,
    @summary
  );
`); // full insert from above
  insert.run({ ...result, finished: result.finished ? 1 : 0 });
}

export function recapExists(id, getRow = false) {
  const row = getRow
    ? db.prepare('SELECT * FROM recaps WHERE id = ?').get(id)
    : db.prepare('SELECT 1 FROM recaps WHERE id = ?').get(id);

  return getRow ? row : !!row;
}

export function updateVideoUrl(id, newUrl) {
  const stmt = db.prepare('UPDATE recaps SET videoUrl = ? WHERE id = ?');
  const result = stmt.run(newUrl, id);
  if( result.changes > 0){
    // console.log(`✅ Updated video URL for recap ${id}`);
  } // true if a row was updated
}