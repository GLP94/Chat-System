import { Link } from "react-router-dom"

export default function Error(){
    return(
        <>
            <p>404: Page does not exist.</p>
            <Link to="/chat" >Back to Chat</Link>
        </>
    )
}