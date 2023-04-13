import "./Header.scss";
import logo from '../../media/FRMSLOGO.png'

function Header () {
    return (
        <div className="header__header">
            <div className="frms">
                <div >
                    <img className="logo" src={logo} alt="FRMS Logo" />
                </div>
            </div>
        </div>
    )
}

export default Header;
