import { useState, useEffect, useRef } from "react"
import { browserRouter as Router, Routes, Route } from "react-router-dom"
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
    const controllerRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("/tokenVerify", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(() => {
            localStorage.removeItem("token");
            setLoggedIn(false);
        })
    }, []);

    return (
        <Router >
            <Header
                loggedIn={loggedIn}
                username={username}
            >
            </Header>
            <MessageModal 
                message={message}
            />
            <Routes>
                <Route path="/chat" element={
                    <Chat 
                        loggedIn={loggedIn}
                        username={username}
                        setMessage={setMessage}
                    />
                } />
                <Route path="/signIn" element={
                    <LoginForm
                    controllerRef={controllerRef}
                    setMessage={setMessage}
                    setLoggedIn={setLoggedIn}
                    setUsername={setUsername}
                    />
                } />
                <Route path="/signUp" element={
                    <SignupForm
                        controllerRef={controllerRef}
                        setUsername={setUsername}
                        setLoggedIn={setLoggedIn}
                        setMessage={setMessage}
                    /> 
                } />
                <Route path="*" element={<Error />} />
            </Routes>
        </Router>
    )
}
