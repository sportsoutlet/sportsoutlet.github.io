const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const allowedOrigin = 'https://sportsoutlet.github.io';

app.use(cors({
  origin: function (origin, callback) {
    if (origin === allowedOrigin || 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

function espnLink(sport) {
  if (sport === 'Baseball') {
    return 'baseball/mlb/'
  } else if (sport === 'American Football') {
    return 'football/nfl/'
  } else if (sport === 'Basketball') {
    return 'basketball/nba/'
  } else if (sport === 'Ice Hockey') {
    return 'hockey/nhl/'
  } else if (sport === 'American Football') {
    return 'football/nfl/'
  } else if (sport === 'Motorsport') {
    return 'racing/f1/'
  }
}

app.get('/game-summary', async (req, res) => {
  const { team } = req.query;
  if (!team) {
    return res.status(400).json({ error: 'Missing team or sport parameter' });
  }

  try {
    // Step 1: Find the team by name and sport
    const dbRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/searchteams.php?t=${team}`);
    const dbTeam = dbRes.data.teams[0];

    const teamId = dbTeam.idTeam;
    const teamName = dbTeam.strTeam || dbTeam.strTeamAlternate;

    const nextEventsRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/eventsnext.php?id=${teamId}`);
    const nextGame = nextEventsRes.data.events?.[0];

    const prevEventsRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/eventslast.php?id=${teamId}`);
    const lastGame = prevEventsRes.data.results?.[0];
    const video = lastGame.strVideo || null;

    const sport = lastGame.strSport;
    const league = lastGame.idLeague;
    const season = lastGame.strSeason;

    var record = {}

    if (sport != 'Motorsport') {
      if (sport === 'Soccer') {
        const soccerRecordTableRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/lookuptable.php?l=${league}&s=${season}`);
        const soccerRecordTable = soccerRecordTableRes.data.table;
        soccerRecordTable.forEach((team) => {
          if (team.idTeam === teamId) {
            record.wins = team.intWin;
            record.losses = team.intLoss;
            record.draws = team.intDraw;
            record.rank = team.intRank;
          }
        });
      } else {
        var standingsRes = await axios.get(`https://site.api.espn.com/apis/v2/sports/${espnLink(lastGame.strSport)}standings`);
        const espnTeams = standingsRes.data.children.flatMap(child => child.standings.entries);

        espnTeams.forEach((team) => {
          var name = team.team.displayName.toLowerCase();
          if (name.toLowerCase() === teamName.toLowerCase()) {
            team.stats.forEach((stat) => {
              if (stat.name === 'wins') {
                record.wins = stat.value;
              } else if (stat.name === 'losses') {
                record.losses = stat.value;
              } else if (stat.name === 'ties') {
                record.draws = stat.value;
              } else if (stat.name === 'divisionWinPercent') {
                record.divisionWinPercent = stat.value;
              } else if (stat.name === 'winPercent') {
                record.winPercent = stat.value;
              } else if (stat.name === 'streak') {
                record.streak = stat.value;
              } else if (stat.name === 'Last Ten Games') {
                record.last10games = stat.summary;
              }
            });
          }
        });
      }
    } else {
      var standingsRes = await axios.get(`https://site.api.espn.com/apis/v2/sports/${espnLink(lastGame.strSport)}standings`);
      const espnTeams = standingsRes.data.children[1].standings.entries;

      espnTeams.forEach((team) => {
        var name = team.team.displayName.toLowerCase();
        if (name.toLowerCase() === teamName.toLowerCase()) {
          team.stats.forEach((stat) => {
            if (stat.name === 'rank') {
              record.rank = stat.value;
            } else if (stat.name === 'championshipPts') {
              record.championshipPts = stat.value;
            }
          });
        }
      });
    }



    if (!lastGame) {
      return res.status(404).json({ error: 'No recent game found' });
    }

    const chatGptData = {
      currentTeam: teamName,
      previousGame: {
        gameName: lastGame.strEventAlternate || lastGame.strEvent,
        sport: lastGame.strSport,
        league: lastGame.strLeague,
        season: lastGame.strSeason,
        homeTeam: lastGame.strHomeTeam,
        awayTeam: lastGame.strAwayTeam,
        homeScore: lastGame.intHomeScore,
        awayScore: lastGame.intAwayScore,
        date: lastGame.dateEvent,
        time: lastGame.strTime,
        description: lastGame.strResult,
        venue: lastGame.strVenue,
        country: lastGame.strCountry,
        hasHighlight: lastGame.strVideo?.length > 1,
      },
      nextGame:
        nextGame ? {
          gameName: nextGame.strEventAlternate || nextGame.strEvent,
          sport: nextGame.strSport,
          league: nextGame.strLeague,
          season: nextGame.strSeason,
          homeTeam: nextGame.strHomeTeam,
          awayTeam: nextGame.strAwayTeam,
          date: nextGame.dateEvent,
          time: nextGame.strTime,
          venue: nextGame.strVenue,
          country: nextGame.strCountry
        } : 'TBA',
      record: record
    }


    const now = new Date();
    const utcDateTime = `${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 19)} UTC`;

    const promptContent = `
Current Date & Time (UTC): ${utcDateTime}

Team: ${chatGptData.currentTeam}
no 

Previous Game:
- Game Name: ${chatGptData.previousGame.gameName}
- Sport: ${chatGptData.previousGame.sport}
- League: ${chatGptData.previousGame.league}
- Season: ${chatGptData.previousGame.season}
- Home Team: ${chatGptData.previousGame.homeTeam}
- Away Team: ${chatGptData.previousGame.awayTeam}
- Home Score: ${chatGptData.previousGame.homeScore}
- Away Score: ${chatGptData.previousGame.awayScore}
- Date: ${chatGptData.previousGame.date}
- Time: ${chatGptData.previousGame.time}
- Description: ${chatGptData.previousGame.description || 'N/A'}
- Venue: ${chatGptData.previousGame.venue}
- Country: ${chatGptData.previousGame.country}
- Highlight Available: ${chatGptData.previousGame.hasHighlight ? 'Yes' : 'No'}

Team Record:
- Wins: ${chatGptData.record.wins}
- Losses: ${chatGptData.record.losses}
- Draws: ${chatGptData.record.draws ?? 0}

Next Game:
${chatGptData.nextGame === 'TBA'
        ? 'TBA'
        : `- Game Name: ${chatGptData.nextGame.gameName}
- Sport: ${chatGptData.nextGame.sport}
- League: ${chatGptData.nextGame.league}
- Season: ${chatGptData.nextGame.season}
- Home Team: ${chatGptData.nextGame.homeTeam}
- Away Team: ${chatGptData.nextGame.awayTeam}
- Date: ${chatGptData.nextGame.date}
- Time: ${chatGptData.nextGame.time}
- Venue: ${chatGptData.nextGame.venue}
- Country: ${chatGptData.nextGame.country}`
      }
`;



    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'o4-mini',
      messages: [
        { role: 'system', content: 'You are a professional sports journalist who writes detailed post-game recaps for any sport. Your summaries are factual, informative, and well-structured — suitable for publication on major sports news sites like ESPN, Bleacher Report, or The Athletic. Always write in full paragraphs with a polished, journalistic tone. Use <div></div> for line breaks if needed, and normal <strong> tags for bold. Avoid emojis, made up information, hashtags, or informal language.' },
        {
          role: 'user', content: `Here is the game information: 
          
          ${promptContent}
          
          Instructions:
Write a 2–3 paragraph game recap focused on the teams most recent game. Start it with "Hello <strong>%user%</strong>, so here's what's new with (the) TEAM_NAME_HERE:<div></div>". replace team name with the team name, make sure if its red bull for example that its not "the redbull" and only "redbull" and vice versa. Start with the final result and its significance. Make sure the inputted team is the subject of the text and not the opposite team. Do not make up any information. Use only the information provided. If context is provided (venue, playoff situation, date, time, etc.), work it naturally into the summary. End with a brief note on what’s next for the team if applicable (their next game or event).

Maintain a professional tone. Do not include bullet points or formatting markers in the output. If there is a game highlight included, somewhere in the middle place the text: "%gamehighlight%", a youtube video will later be imbeded there, make sure it does not seperate text, be sure to have something to introduce the highlights as well with a colon, they will most likely be a compilation of videos, be sure to use <strong> tags for bolding things like scores and other important pieces, make sure to not use tags surrounding the video highlight marker, also do not put line breaks around the video, the video will have spacing already. use line breaks in between each paragraph - <div></div>. 

          ` }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });



    // ✅ Return it directly to the frontend
    res.json({ summary: response.data.choices[0].message.content, videoUrl: video });

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});