import { useState } from "react"
import axios from "axios"

export default function Chat({ posts, username, setMessage }) {
    const [post, setPost] = useState("");

    async function handlePost(event) {
        event.preventDefault();

        const newPost = {
            username: username,
            post: post
        }

        try {
            const response = await axios.post("/api/posts", newPost);
            if (response.status === 201) {
                return setMessage(response.data);
            }
        }
        catch (err) {
            setMessage(err.message);
            console.error(err);
        }

    }

    return (
        <main>
            {posts.map(p => (
                <div key={p._id}>
                    <p>
                        <span>{p.username}</span>
                        -
                        <span>{p.time.toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        })}
                        </span>
                    </p>
                    <p>{p.content}</p>
                </div>
            ))}
            <form
                OnSubmit={(event) => handlePost(event)}
            >
                <input
                    type="text"
                    name="post"
                    value={post}
                    onChange={(event) => setPost(event.target.value)}
                >
                </input>
                <button
                    type="submit"
                >
                    Send
                </button>
            </form>
        </main>
    )
}