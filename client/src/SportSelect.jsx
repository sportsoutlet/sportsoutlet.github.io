import './sport-select.css'
import { sports } from './sports.js'




function SportSelect({ setSport }) {

    return (
        <div className='sport-form-wrapper'>
            <div className='sport-form common-form-wrapper'>
                <h1>Select your Sport</h1>
                {sports.map((sport) => (
                    <button key={sport.back} onClick={() => setSport(sport.back)}>{sport.front}</button>
                ))}
            </div>
        </div>
    )
}

export default SportSelect;