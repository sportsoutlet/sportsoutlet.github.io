import './header.css'
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import { useAppContext } from './AppContext';


const navigationItems = [
    { name: 'Featured', path: '/featured' },
    { name: 'Live Games', path: '/myteams' },
    { name: 'My Teams', path: '/myteams' },
];

function Header() {

    const navigate = useNavigate();


    const { userInfo, setUserInfo } = useAppContext();

    return (
        <div className="header-outer">
            <div className='header-title'>
                <h1>Gabo</h1>
            </div>
            <div className="header-inner">
                <nav className="header-nav">
                    {navigationItems.map(item => (
                        <a key={item.name} onClick={() => navigate(item.path)} className="header-link">
                            {item.name}
                        </a>
                    ))}
                </nav>


            </div>
            <div className="header-user">
                <EditProfile userInfo={userInfo} setUserInfo={setUserInfo} />
            </div>
        </div>
    );
}

export default Header;