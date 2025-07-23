import { use, useEffect, useRef } from 'react';



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




function useGetLastGameRecap(teams, recaps, setRecaps) {


    const intervalRef = useRef(null);
    const recapsRef = useRef(recaps);


    async function fetchRecap(team, bypassRepeatCheck = false) {
        try {
            if (bypassRepeatCheck) {
                var hasRecap = recapsRef.current.some(recap => recap.teamName === team);
                // const res = await fetch(`http://localhost:3000/game-summary?team=${team}`);
                const res = await fetch(`https://sports-api-o71j.onrender.com/game-summary?team=${team}`);
                const data = await res.json();

                if (data?.summary) {
                    if (hasRecap) {
                        var repeatedEvent = recapsRef.current.some(recap => recap.id === data.id);
                        const content = extractTaggedSections(data.summary);
                        if (!repeatedEvent) {
                            setRecaps(prev => [
                                ...prev.filter(recap => recap.teamName !== data.teamName),
                                {
                                    ...data,
                                    summary: content.cleaned,
                                    summaryTitle: content.matches[0] || 'Game Recap',
                                }
                            ]);
                        } else {
                            // console.log(`Recap for ${team} already exists.`);
                        }

                    }
                }
            } else {
                var hasRecap = recapsRef.current.some(recap => recap.teamName === team);
                if (!hasRecap) {
                    const res = await fetch(`https://sports-api-o71j.onrender.com/game-summary?team=${team}`);
                    // const res = await fetch(`http://localhost:3000/game-summary?team=${team}`);
                    const data = await res.json();

                    if (data?.summary) {
                        const content = extractTaggedSections(data.summary);
                        setRecaps(prev => [
                            ...prev,
                            {
                                ...data,
                                summary: content.cleaned,
                                summaryTitle: content.matches[0] || 'Game Recap',  // spread all fields from the API response
                            }
                        ]);

                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch summary:', err);
        }
    }




    useEffect(() => {
        if (teams.length > 0) {
            teams.forEach(team => {
                fetchRecap(team.teamBack); // use teamBack for API calls
            });
        }
    }, [teams]);



    useEffect(() => {

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            teams.forEach(team => {
                fetchRecap(team.teamBack, true); // bypass repeat check for periodic updates
            });
        }, 20000);

        return () => clearInterval(intervalRef.current);
    }, [teams, recaps]);





    useEffect(() => {
        if (!recaps || recaps.length === 0) return;
        const uniqueByTeam = Array.from(
            new Map(recaps.map(item => [item.teamName, item])).values()
        );


        const currentTeamNames = teams.map(team => team.teamBack);

        const filtered = uniqueByTeam.filter(
            recap => currentTeamNames.includes(recap.teamName)
        );

        if (filtered.length !== recaps.length) {
            setRecaps(filtered);
        }

    }, [recaps, teams]);



    useEffect(() => {
        recapsRef.current = recaps;
        console.log('Recaps updated:', recaps);
    }, [recaps]);

}

export default useGetLastGameRecap;