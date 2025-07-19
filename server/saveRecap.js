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

export function recapExists(id) {
  const row = db.prepare('SELECT 1 FROM recaps WHERE id = ?').get(id);
  return !!row;
}

