import './sport-select.css'
import { sports } from './sports.js'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext';






function SportSelect() {

    const { setSport } = useAppContext();

    const navigate = useNavigate();


    return (
        <div className='sport-form-wrapper'>
            <div className='sport-form common-form-wrapper'>
                <h1>Select your Sport</h1>
                {sports.map((sport) => (
                    <button key={sport.back} onClick={(e) => {e.currentTarget.blur(); setSport(sport.back); navigate('/myteams/teams')}}>{sport.front}</button>
                ))}
            </div>
        </div>
    )
}

export default SportSelect;