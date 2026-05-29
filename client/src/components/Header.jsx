import { Link } from "react-router-dom"

export default function Header({ loggedIn, username }) {
    return (
        <header>
            {!loggedIn
                ?
                <nav>
                    <Link to="/signIn">Sign In</Link>
                    <Link to="/signUp">Sign Up</Link>
                </nav>
                :
                <nav>
                    <p>Welcome, {username}!</p>
                    <button onClick={() => LogOut()} >Log Out</button>
                    <Link to={`/userPage/${username}`}>User Page</Link>
                </nav>
            }
        </header>
    )
}