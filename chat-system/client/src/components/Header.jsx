export default function Header({ children, loggedIn, username }) {
    return (
        <header>
            {!loggedIn
                ?
                children
                :
                <p>Welcome, {username}!</p>
            }
        </header>
    )
}