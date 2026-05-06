import React, { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function App() {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [posts, setPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const controllerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("/api/verify", {
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
            axios.get("/api/posts")
                .then(response => setPosts(response.data));
        }
        catch(err){
            setErrorMessage("Unable to fetch posts.");
            console.error(err);
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault();
        if (controllerRef.current) controllerRef.current.abort();

        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            const response = await axios.post("/api/login", credentials, { signal });
            const token = response.data.token;

            localStorage.setItem("token", token);

            setMessage(response);

            if (response.status === 200){
                setLoggedIn(true);
                setUsername(credentials.username);
            }
            else {
                return;
            }
        }
        catch(err){
            if (axios.isAxiosError(err)){
                console.error("Axios has encountered an error");
                console.error(err);
            }
            else if (err.response){
                console.error("Server declined request.");
                console.error(err)
            }
            else if (err.request){
                console.error("Server could not respond to request.");
                console.error(err);
            }
            else {
                console.error("Error with your request.");
                console.error(err);
            }

            setMessage(err);
        }
        finally{
            setCredentials({username: "", password: ""})
        }
    }
        

    return (
        <>
            <form>
                <label> Username
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                    />
                </label>
                <label> Password
                    <input
                        type="text"
                        name="password"
                        value={credentials.password}
                        onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                    />
                </label>
                <button 
                    type="submit"
                    onClick={(event) => handleSubmit(event)}
                >
                    Login
                </button>
            </form>

            <main>
                <p>Welcome, {username ? username : "Guest"}!</p>
            </main>
        </>
    )
}
