import Chat from "./models/Chat.js"
import User from "./models/User.js"

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import initialDBSetup from "./initialDBSetup.js";
import bcrypt from "bcrypt"

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

/* User Sign Up */

const handleSignUp = async (req, res, next) => {
    if (req.body.username.length < 4 ||
        req.body.username.length > 16 ||
        req.body.password.length < 4 ||
        req.body.password.length > 16
    ) {
        return res.status(400).json({ message: "Password/Username too short/long" });
    };

    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        await user.save();
        res.locals.username = user.username;
        next();
    }
    catch (err) {
        next(err);
    }
}

app.post("/api/registration", handleSignUp, (req, res) => {
    return res.status(201).json({ username: res.locals.username, message: "Successful Signup!" });
});

/* User Sign In */

const signIn = async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const userFound = await User.findOne({ username });
        if (!userFound) {
            return res.status(401).json({ message: "User not found!" });
        }
        if (!await bcrypt.compare(password, userFound.password)) {
            return res.status(400).json({ message: "Password invalid!" })
        }
        return res.status(200).json({ username });
    }
    catch (err) {
        next(err);
    }
}

app.post("/api/verification", signIn);

/* Posts */

app.get("/api/posts", async (req, res, next) => {
    try {
        const chat = await Chat.find();
        return res.status(200).json(chat);
    }
    catch (err) {
        next(err);
    }
});

app.post("/api/posts", async (req, res, next) => {
    const { username, post } = req.body;
})

/* Server Listen */

app.listen(port, () => {
    console.log(`Server listening to PORT ${port}`)
});

/* Error Handling */

app.use((err, req, res, next) => {
    console.error(`Path: ${req.path}`)
    console.error(`Stack ${err.stack}`);

    if (err.code === 11000) {
        return res.status(
            err.status || 400
        ).json({
            error: true,
            message: "Username/Password already present."
        });
    }

    return res.status(
        err.status || 500
    ).json({
        error: true,
        message: err.status < 500 ? err.message : "Internal server error."
    });
});