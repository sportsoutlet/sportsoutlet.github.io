import { useEffect, useState } from 'react';
import FeaturedEvent from './FeaturedEvent';

function Featured() {

    const [featuredGames, setFeaturedGames] = useState([]);

    async function fetchLast10Recaps() {
        try {
            // const res = await fetch('http://localhost:3000/latest-recaps');
            const res = await fetch('https://sports-api-o71j.onrender.com/latest-recaps');
            const data = await res.json();
            console.log(data);
            setFeaturedGames(data);
            return data;
        } catch (error) {
            console.error("Error fetching latest recaps:", error);
        }
    }

    useEffect(() => {
        fetchLast10Recaps();
    }, []);

    useEffect(() => {
        console.log('Featured games updated:', featuredGames);
    }, [featuredGames]);

    return (<div className='max-w-150'>
        {featuredGames.length > 0 ? (<div>
            {featuredGames.map((event, index) => (
                <FeaturedEvent key={index} event={event} />
            ))}</div>) : (<div>Loading...</div>)}
    </div>)
}

export default Featured;