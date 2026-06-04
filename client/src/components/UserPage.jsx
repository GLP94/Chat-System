import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export default function UserPage() {
    const { user } = useParams();

    const [ username, setUsername ] = useState("");


    useEffect(() => {
        const fetchUserInfo = async () => {
            try{
                const response = await axios.get(`/api/users/${user}`);
                setUsername(response.data);
            }
            catch(err){
                console.error(err);
            }
            
        }

        fetchUserInfo();
    }, [user])
}