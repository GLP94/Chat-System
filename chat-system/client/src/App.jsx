import { useState, useEffect, useRef } from "react"
import axios from "axios"

import Header from "./components/Header.jsx";
import MessageModal from "./components/MessageModal.jsx";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import Chat from "./Chat.jsx"

export default function App() {
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
        try {
            axios.get("/api/posts")
                .then(response => setPosts(response.data));
        }
        catch (err) {
            console.error(err);
        }
    }, [])

    return (
        <>
            <Header
                loggedIn={loggedIn}
                username={username}

            >
                <LoginForm
                    controllerRef={controllerRef}
                    setMessage={setMessage}
                    setLoggedIn={setLoggedIn}
                    setUsername={setUsername}
                >
                </LoginForm>
                <SignupForm
                    controllerRef={controllerRef}
                    setUsername={setUsername}
                    setLoggedIn={setLoggedIn}
                    setMessage={setMessage}
                ></SignupForm>
            </Header>
            <MessageModal 
                message={message}
            />
            <Chat 
                posts={posts}
                username={username}
                setMessage={setMessage}
            />
        </>
    )
}
