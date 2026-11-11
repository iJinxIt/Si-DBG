import { NavLink } from 'react-router-dom'

function Header() {
    return (
        <header className="navbar header">
            <nav className="navbar-link">
                <NavLink to="/" className="navbar-brand navbar-button">Si-DBG</NavLink>
                <NavLink className="navbar-button" to="/flash">Flash</NavLink>
            </nav>

        </header>
    )
}

export default Header
