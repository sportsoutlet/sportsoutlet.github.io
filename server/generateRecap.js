import axios from 'axios';
import dotenv from 'dotenv';
import { recapExists, updateVideoUrl } from './saveRecap.js';
dotenv.config(); // load environment variables


const sportsDB = 'https://www.thesportsdb.com/api/v2/json'





var leagueList = [4424,]


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

async function generateRecap(team, sportParam) {
    try {
        // Step 1: Find the team by name and sport
        const dbRes = await axios.get(`${sportsDB}/search/team/${team}`,
            {
                headers: {
                    'X-API-KEY': process.env.SPORTSDB_API,
                },
            }
        );



        const dbTeam = dbRes.data.search[0];

        const teamId = dbTeam.idTeam;
        const teamName = dbTeam.strTeam;
        const leagueID = dbTeam.idLeague;

        var nextGame;

        var nextEventsRes;
        if (sportParam != 'f1') {
            nextEventsRes = await axios.get(`${sportsDB}/schedule/next/team/${teamId}`,
                {
                    headers: {
                        'X-API-KEY': process.env.SPORTSDB_API, // or whatever header key TheSportsDB expects
                    },
                }
            );
            nextGame = nextEventsRes.data.schedule?.[0];
        }



        var prevEventsRes;
        var lastGame;

        if (sportParam != 'f1') {
            prevEventsRes = await axios.get(`${sportsDB}/schedule/previous/team/${teamId}`,
                {
                    headers: {
                        'X-API-KEY': process.env.SPORTSDB_API, // or whatever header key TheSportsDB expects
                    },
                }
            );

            if (prevEventsRes.data.schedule?.[0].strStatus == 'FT' || !prevEventsRes.data.schedule?.[0].strStatus) {
                lastGame = prevEventsRes.data.schedule?.[0];
            } else {
                lastGame = prevEventsRes.data.schedule?.[1];
            }

        } else {
            const currentYear = new Date().getUTCFullYear();
            prevEventsRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/eventsseason.php?id=${leagueID}&s=${currentYear}`);
            var closestEvent = null;
            var closestEventUTC = null;
            var closestFutureEvent = null;
            var closestFutureEventUTC = null;
            prevEventsRes.data.events.forEach((event) => {
                var nowUTC = Date.now();
                var eventUTC = new Date(event.strTimestamp).getTime();
                if (eventUTC < nowUTC && !event.strEvent.toLowerCase().includes('practice') && !event.strEvent.toLowerCase().includes('qualifying') && event.strStatus === 'Match Finished') {
                    if (!closestEventUTC || eventUTC > closestEventUTC) {
                        closestEvent = event;
                        closestEventUTC = eventUTC;
                    }

                } else if (eventUTC > nowUTC && !event.strEvent.toLowerCase().includes('practice') && !event.strEvent.toLowerCase().includes('qualifying')) {
                    if (!closestFutureEventUTC || eventUTC < closestFutureEventUTC) {
                        closestFutureEvent = event;
                        closestFutureEventUTC = eventUTC;
                    }
                }
            });

            lastGame = closestEvent;
            nextGame = closestFutureEvent;

        }



        if (recapExists(`${teamName} ${lastGame.idEvent}`)) {
            // console.log(`⚠️ Recap already exists for ${teamName} on ${lastGame.dateEvent} ... id: ${lastGame.idEvent}`);
            const recapData = recapExists(`${teamName} ${lastGame.idEvent}`, true);
            if(!recapData.videoUrl && lastGame.strVideo ) {
                console.log(`Recap already exists for ${teamName} but new video found, regenerating...`);
                updateVideoUrl(`${teamName} ${lastGame.idEvent}`, lastGame.strVideo);
            } 

            return null;
        }

        const video = lastGame.strVideo || null;

        const sport = lastGame.strSport;
        const league = lastGame.idLeague;
        const season = lastGame.strSeason;

        var record = {}

        if (sport != 'Motorsport') {
            if (sport === 'Soccer') {
                const soccerRecordTableRes = await axios.get(`https://www.thesportsdb.com/api/v1/json/${process.env.SPORTSDB_API}/lookuptable.php?l=${league}&s=${season}`);
                if (soccerRecordTableRes.data.table) {
                    const soccerRecordTable = soccerRecordTableRes.data.table;
                    soccerRecordTable.forEach((team) => {
                        if (team.idTeam === teamId) {
                            record.wins = team.intWin;
                            record.losses = team.intLoss;
                            record.draws = team.intDraw;
                            record.rank = team.intRank;
                        }
                    });
                }
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
                altDescription: lastGame.strDescriptionEN,
                venue: lastGame.strVenue,
                country: lastGame.strCountry
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
- Alt Description: ${chatGptData.previousGame.altDescription || 'N/A'}
- Venue: ${chatGptData.previousGame.venue}
- Country: ${chatGptData.previousGame.country}

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
            model: 'gpt-4.1',
            messages: [
                { role: 'system', content: 'You are a professional sports journalist who writes detailed post-game recaps for any sport. Your summaries are factual, informative, and well-structured — suitable for publication on major sports news sites like ESPN, Bleacher Report, or The Athletic. Always write in full paragraphs with a polished, journalistic tone. Use <div></div> for line breaks if needed, and normal <strong> tags for bold. Avoid emojis, made up information, hashtags, or informal language.' },
                {
                    role: 'user', content: `Here is the game information: 
          
          ${promptContent}
          
          Instructions:
Write a 2–3 paragraph game recap focused on the teams most recent game. Start it with "Hello <strong>%user%</strong>, so here's what's new with (the) TEAM_NAME_HERE:<div></div>". replace team name with the team name, make sure if its red bull for example that its not "the redbull" and only "redbull" and if its "yankees" for example to make sure its "the yankees". Start with the final result and its significance. Make sure the inputted team is the subject of the text and not the opposite team. Do not make up any information. Use only the information provided. If context is provided (venue, playoff situation, date, time, etc.), work it naturally into the summary. End with a brief note on what’s next for the team if applicable (their next game or event), be sure to add the time if its within the next week or so.

Maintain a professional tone. Do not include bullet points or formatting markers in the output. Do not use the word "edge". Be generous when using <strong> tags for bolding things like scores, or other important pieces, use line breaks in between each paragraph - <div></div>. Generate a short, engaging, fan-friendly title for this recap.
Avoid generic labels like "Recap" or "Summary." Instead, focus on the action, outcome, or team storyline. Keep them under 12 words. Surround the title with %=% tags, like this: %=Title Here=% and place it at the bottom, make sure theres not quotes surrounding the title, heres a few more examples: %=Yankees Win in Dramatic Fashion=%, %=Red Bulls Dominate Rival in Home Opener=%, %=Lakers Secure Playoff Spot with Thrilling Victory=%

          ` }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        var teamBadge;
        if (sportParam != 'f1') {
            if (lastGame.strHomeTeam.includes(teamName)) {
                teamBadge = lastGame.strHomeTeamBadge;
            } else {
                teamBadge = lastGame.strAwayTeamBadge;
            }
        }


        const result = {
            id: `${teamName} ${lastGame.idEvent}`,
            fileName: `${teamName} ${lastGame.strTimestamp}`,
            title: lastGame.strEventAlternate || lastGame.strEvent,
            teamName: teamName,
            date: lastGame.dateEvent,
            time: lastGame.strTime,
            venue: lastGame.strVenue,
            sport: lastGame.strSport,
            league: lastGame.strLeague,
            season: lastGame.strSeason,
            altEventId: lastGame.idAPIfootball,
            teamId: teamId,
            leagueId: lastGame.idLeague,
            homeTeamId: lastGame.idHomeTeam,
            awayTeamId: lastGame.idAwayTeam,
            homeTeam: lastGame.strHomeTeam,
            awayTeam: lastGame.strAwayTeam,
            homeScore: lastGame.intHomeScore,
            awayScore: lastGame.intAwayScore,
            videoUrl: video,
            teamBadge: teamBadge,
            homeTeamBadge: lastGame.strHomeTeamBadge,
            awayTeamBadge: lastGame.strAwayTeamBadge,
            leagueBadge: lastGame.strLeagueBadge,
            thumbnail: lastGame.strThumb,
            poster: lastGame.strPoster,
            finished: lastGame.strStatus === 'FT' || !lastGame.strStatus || lastGame.strStatus === 'Match Finished',
            summary: response.data.choices[0].message.content

        }
        // ✅ Return it directly to the frontend
        return result;

    } catch (error) {
        console.error("❌ Error trying to find:" + ' ' + team, error.stack || error);
        return null;
    }
}



export default generateRecap;

