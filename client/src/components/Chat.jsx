import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

export default function Chat({ loggedIn, username, setMessage }) {
    const [newPost, setNewPost] = useState("");
    const [posts, setPosts] = useState("");

    async function handlePost(event) {
        event.preventDefault();

        const postRequest = {
            username: username,
            content: newPost
        }

        try {
            const response = await axios.post("/api/posts", postRequest);
            if (response.status === 201) {
                return setMessage(response.data);
            }
        }
        catch (err) {
            setMessage(err.message);
            return console.error(err);
        }
    }

    async function deletePost(_id) {
        try{
            axios.delete(`/api/posts/:${_id}`,);
        }
        catch(err){
            setMessage(err.message);
            return console.error(err);
        }
    }

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
        <main>
            <section>
                {
                    !loggedIn ?
                        <div>
                            <Link to="/signIn">Sign In</Link>
                            <span>or</span>
                            <Link to="/signUp">Sign Up</Link>
                            <span>to use the chat</span>
                        </div>
                        :
                        (posts || []).map(p => (
                            <div key={p._id}>
                                <div>
                                    <span>{p.username}</span>
                                    -
                                    <span>{new Date(p.time).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    })}
                                    </span>
                                </div>
                                <p>{p.post}</p>
                                <button 
                                    OnClick={() => deletePost(p._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
            </section>
            {
                loggedIn &&
                    <form
                        onSubmit={(event) => handlePost(event)}
                    >
                        <input
                            type="text"
                            name="post"
                            value={newPost}
                            onChange={(event) => setNewPost(event.target.value)}
                        >
                        </input>
                        <button
                            type="submit"
                        >
                            Send
                        </button>
                    </form>
            }
        </main>
    )
}