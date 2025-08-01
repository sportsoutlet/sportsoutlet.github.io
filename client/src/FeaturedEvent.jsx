import './featured-event.css';

function extractTaggedSections(str) {
    const regex = /%=(.*?)=%/g;
    const matches = [];
    let cleaned = str;

    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(match[1]); // only the inside content
    }

    // Optionally, remove the tags from the original string
    cleaned = cleaned.replace(regex, '').trim();

    return { matches, cleaned };
}


function timeAgo(dateStr) {
    const past = new Date(dateStr.replace(' ', 'T') + 'Z'); // now guaranteed to be treated as UTC
    const now = new Date();
    const diff = Math.floor((now - past) / 1000); // seconds

    if (diff < 60) return `${diff} second${diff !== 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}


function FeaturedEvent({ event, ...props }) {
    const { teamName, videoUrl, teamBadge, summary, homeScore, awayScore, homeTeam, awayTeam, thumbnail, league, sport, created_at } = event;

    const content = extractTaggedSections(summary);
    const summaryText = content.cleaned || 'No summary available.';
    const summaryTitle = content.matches[0] || 'Featured Event';
    const isHomeTeam = teamName === homeTeam;
    const primaryTeam = teamName;
    const secondaryTeam = isHomeTeam ? awayTeam : homeTeam;
    const primaryTeamScore = isHomeTeam ? homeScore : awayScore;
    const secondaryTeamScore = isHomeTeam ? awayScore : homeScore;
    const result = primaryTeamScore > secondaryTeamScore ? 'Win' : 'Loss';


    let leagueName;

    if (!league) {
        if (sport == 'Baseball') {
            leagueName = 'MLB';
        }
    } else {
        leagueName = league;
    }

    function handleMissingThumbnail(sport) {
        const size = 'medium'; // or 'medium' based on your needs
        if (sport === 'Baseball') {
            return `/backup_images/baseball-${size}.jpg`;
        } else if (sport === 'American Football') {
            return `/backup_images/football-${size}.jpg`;
        } else if (sport === 'Basketball') {
            return `/backup_images/basketball-${size}.jpg`;
        } else if (sport === 'Ice Hockey') {
            return `/images/hockey-${size}.jpg`;
        } else if (sport === 'Soccer') {
            return `/backup_images/soccer-${size}.jpg`;
        } else if (sport === 'Motorsport') {
            return `/backup_images/f1-${size}.jpg`;
        }
        return '/backup_images/default.jpg'; // Fallback image

    }



    return (
        <div className="featured-event bg-[rgb(44,44,44)] my-5 rounded-xl px-6 pb-6 good-shadow" {...props}>
            <div className="flex items-center p-2 justify-between">
                <div className='flex items-center'>
                    <img width="70px" src={teamBadge + '/tiny'} />
                    <div className="flex flex-col align-start justify-around ml-4">
                        <h2 className="font-bold w-fit text-lg m-0">{teamName}</h2>
                        <p className="w-fit opacity-80 m-0">{leagueName}</p>
                    </div>
                </div>
                {primaryTeamScore != null &&
                    <div>
                        <p className=''>{primaryTeamScore + '-' + secondaryTeamScore}</p>
                        <p className={result == 'Win' ? 'text-green-500' : 'text-red-500'}>{result}</p>
                    </div>
                }
            </div>
            <div className="flex flex-col strong-shadow rounded-xl overflow-hidden">
                <img src={thumbnail ? thumbnail + '/medium' : handleMissingThumbnail(sport)} alt={`${teamName} event thumbnail`} />
                <div className="flex flex-col align-start px-3 py-2">
                    <h3 className="w-fit font-bold text-lg">{summaryTitle}</h3>
                    <p className="w-fit">{timeAgo(created_at)}</p>
                </div>
            </div>
        </div>
    );
}

export default FeaturedEvent;