import Chat from "./models/Chat.js"
import Users from "./models/Users.js"

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import initialDBSetup from "./initialDBSetup.js";

const port = 5000;

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

mongoose.connect('mongodb://127.0.0.1:27017/chatDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    return initialDBSetup();
});

/* Users Fetch */

app.post("/api/verification", async (req, res) => {
    try{
        const {username, password} = req.body;
        const userFound = await Users.findOne({username, password});
        if (!userFound){
            res.status(401).send("User not found!");
            return;
        }
        res.status(200).send("Verified!")
    }
    catch(err){
        console.error(err);
    }
})

/* Posts Fetch */

app.get("/api/posts", async (req, res) => {
    try{
        const chat = await Chat.find();
        res.status(200).json(chat);
    }
    catch(err){
        console.error(err);
    }
})

/* Server Listen */

app.listen(port, () => {
    console.log(`Server listening to PORT ${port}`)
});