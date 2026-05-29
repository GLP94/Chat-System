import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Form({controllerRef, setMessage, setLoggedIn, setUsername}){
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async (event) => {

        event.preventDefault();

        if (controllerRef.current) controllerRef.current.abort();
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            const response = await axios.post("/api/login", credentials, { signal });
            const token = response.data.token;

            if (response.status === 200){
                localStorage.setItem("token", token);
                setLoggedIn(true);
                setUsername(response.data.username);
                navigate("/chat");
            }
            else {
                setMessage(response.message);
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

    return(
        <form onSubmit={(event) => handleLogin(event)}>
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
            >
                Login
            </button>
        </form>
    )
}