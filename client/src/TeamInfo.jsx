import BackButton from "./BackButton";

function TeamInfo({setDisplaySummary, setActiveTeam, activeTeam}) { 


    return (
        <div className="mt-15 mx-10">
            <BackButton className='absolute top-1 left-4 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-colors max-w-fit' whenClicked={() => setActiveTeam()}/>
            <h1>{activeTeam.team + ' Latest News'}</h1>
        <button onClick={() => setDisplaySummary(true)}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">Last Game:</h2><p className="text-left">This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a re... </p></div></button>
        <button onClick={() => setDisplaySummary(true)}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">Star Player:</h2><p className="text-left">This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a re... </p></div></button>
        <button onClick={() => setDisplaySummary(true)}><div className="team-info p-4"><h2 className="text-left text-2xl mb-4">Top 5 helmets to try in 2025:</h2><p className="text-left">This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a recap. This is spacer content meant to emulate a re... </p></div></button>
        </div>
    )
}

export default TeamInfo;