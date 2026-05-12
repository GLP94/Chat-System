import { useState, useEffect, useRef } from "react"
import axios from "axios"
import LoginForm from "./LoginForm.jsx"
import SignupForm from "./SignupForm.jsx"

export default function App() {
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [posts, setPosts] = useState([]);
    const controllerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios
        .get("/api/verification", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .catch(() => {
            localStorage.removeItem("token");
            setLoggedIn(false);
        })

    }, []);

    useEffect(() => {
        try{
            axios
            .get("/api/posts")
            .then(response => setPosts(response.data));
        }
        catch(err){
            console.error(err);
        }
    }, [])
        
    return (
        <main>
            <header>
                {loggedIn 
                ?
                <section>
                    <p>Sign in!</p>
                    <LoginForm 
                        prop={{
                            controllerRef, 
                            setMessage, 
                            setLoggedIn, 
                            setUsername
                        }}
                    >
                    </LoginForm>
                    <p>Sign up!</p>
                    <SignupForm
                        prop={{
                            setUsername,
                            setLoggedIn,
                            setMessage
                        }}
                    ></SignupForm>
                </section>
                :
                <p>Welcome, {username}!</p>
                }
            </header>
            <div>
                {message}
            </div>
            <main>
                {posts.map(p => (
                    <div key={p._id}>
                        <p>{p.user}</p>
                        <p>{String(p.time)}</p>
                        <p>{p.content}</p>
                    </div>
                ))}
            </main>
        </main>
    )
}
