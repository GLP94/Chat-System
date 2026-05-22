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
                <p>Welcome, {username}!</p>
            }
        </header>
    )
};