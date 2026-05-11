import { useState, useEffect, useRef } from "react"
import axios from "axios"
import LoginForm from "./LoginForm.jsx"

export default function App() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [posts, setPosts] = useState([]);
    const controllerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("/api/verification", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
            })
    }, []);

    useEffect(() => {
        try{
            axios.get("/api/posts")
                .then(response => setPosts(response.data));
        }
        catch(err){
            console.error(err);
        }
    }, [])
        
    return (
        <main>
            <p>Welcome, {username ? username : "Guest"}!</p>
            <p>{message}</p>
            <div>
                {loggedIn 
                ?
                <>
                    <p>Please sign in!</p>
                    <LoginForm 
                        prop={{
                            credentials, 
                            setCredentials, 
                            controllerRef, 
                            setMessage, 
                            setLoggedIn, 
                            setUsername
                        }}
                    >
                    </LoginForm>
                </>
                :
                <>
                    <p>{message}</p>
                    {posts.map(p => (
                        <div key={p._id}>
                            <p>{p.user}</p>
                            <p>{String(p.time)}</p>
                            <p>{p.content}</p>
                        </div>
                    ))}
                </>
                }
            </div>
        </main>
    )
}
