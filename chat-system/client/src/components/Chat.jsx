import { useState } from "react"
import axios from "axios"

export default function Chat({ posts, username, setMessage }) {
    const [post, setPost] = useState("");

    async function handlePost() {
        const newPost = {username, post}

        try{
            const response = await axios.post("/api/posts", newPost);
            if (response.status === 200){
                return setMessage(response.data);
            }
        }
        catch(err){
            setMessage(err.message);
            console.error(err);
        }

    }

    return (
        <main>
            <form
                OnSubmit={handlePost}
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
            {posts.map(p => (
                <div key={p._id}>
                    <p>{p.user}</p>
                    <p>{String(p.time)}</p>
                    <p>{p.content}</p>
                </div>
            ))}
        </main>
    )
}