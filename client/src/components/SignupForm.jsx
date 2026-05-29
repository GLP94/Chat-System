import { useState } from "react"
import axios from "axios"

export default function SignupForm({ controllerRef, setUsername, setLoggedIn, setMessage }) {

    const [credentials, setCredentials] = useState({ username: "", password: "" });

    const handleSignup = async (event) => {

        event.preventDefault();

        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            const response = axios.post("/api/registration", credentials, { signal });
            if (response.status === 201) {
                setUsername(response.data.username);
                setLoggedIn(true);
            }
            else{
                setMessage(response.data.message);
                return;
            }
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                console.error("Axios has encountered an error");
                console.error(err);
            }
            else if (err.response) {
                console.error("Server declined request.");
                console.error(err)
            }
            else if (err.request) {
                console.error("Server could not respond to request.");
                console.error(err);
            }
            else {
                console.error("Error with your request.");
                console.error(err);
            }
        }
        finally {
            setCredentials({ username: "", password: "" })
        }

    }

    return (
        <form>
            <label> Username
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    min={4}
                    max={16}
                    onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
                />
            </label>
            <label> Password
                <input
                    type="text"
                    name="password"
                    value={credentials.password}
                    min={4}
                    max={16}
                    onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                />
            </label>
            <button
                type="submit"
                onClick={(event) => handleSignup(event)}
            >
                Signup
            </button>
        </form>
    )
}