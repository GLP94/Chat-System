import { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import axios from "axios"

import Header from "./components/Header.jsx";
import MessageDialog from "./components/MessageDialog.jsx";
import LoadingDialog from "./components/LoadingDialog.jsx";
import LoginForm from "./components/LoginForm.js";
import SignupForm from "./components/SignupForm.js";
import Chat from "./components/Chat.js"
import UserPage from "./components/UserPage.js"
import Loading from "./components/Loading.js"
import Error from "./components/Error.js"

export default function App() {
    const [username, setUsername] = useState("Guest");
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const controllerRef = useRef(null);

    /* Token Verification on Startup */
    useEffect(() => {
        const tokenVerification = async function () {
            const token = localStorage.getItem("token");
            if (!token){
                setLoading(false);
                return;
            };

            try {
                const response = await axios.get("/tokenVerify", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsername(response.data);
                setLoggedIn(true);
            }
            catch (err) {
                console.error(`Error with the Token verification: ${err}`);
                localStorage.removeItem("token");
            }
            finally{
                setLoading(false);
            }
        }

        tokenVerification();
    }, []);

    return (
        <Router>
            <Header
                loggedIn={loggedIn}
                username={username}
            >
            </Header>
            <LoadingDialog 
                loading={loading}
            />
            <MessageDialog
                message={message}
            />
            {
                loading
                    ?
                    <Loading />
                    :
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
                        <Route path="/userPage/:username" element={<UserPage />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
            }
        </Router>
    )
}
