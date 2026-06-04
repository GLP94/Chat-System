import Chat from "./models/Chat.js"
import User from "./models/User.js"

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

const databaseConnection = async function(){
    try{
        await mongoose.connect(process.env.URI || "mongodb://127.0.0.1:27017/chatDB");

        const PORT = process.env.PORT;
        app.listen(PORT || 5000, () => {
            console.log(`Server listening`)
            console.log(`${PORT || 5000}`)
        })
    }
    catch(err){
        console.error(`Server error.`);
        console.error(err);
    }
};

databaseConnection();

/* User Sign Up */

const handleSignUp = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password ||
        password.length < 4 ||
        password.length > 16 ||
        username.length < 4 ||
        username.length > 16
    ) {
        return res.status(400).json({ message: "Invalid credentials." });
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
};

app.post("/api/signUp", handleSignUp, (req, res) => {
    return res.status(201).json({ username: res.locals.username, message: "Successful Signup!" });
});

/* User Sign In */

const signIn = async function (req, res, next) {
    const { username, password } = req.body;

    try {
        const userFound = await User.findOne({ username });

        if (!userFound) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        if (!await userFound.passwordCheck(password)) {
            return res.status(400).json({ message: "Invalid credentials." })
        }

        if (userFound.isBanned){
            return res.status(400).json({message: "Account has been banned."})
        }

        const token = userFound.authenticate();

        return res.status(200).json({ username, token });
    }
    catch (err) {
        next(err);
    }
};

app.post("/api/singIn", signIn);

/* User GET */

const userGet = async function (req, res, next) {
    try{
        const {username} = req.params;
        if (!username) return res.status(400).json({message: "Username required."})

        const userFound = await User.findOne({username});
        if (!userFound) return res.status(401).json({message: "Something went wrong with the fetching."});

        res.locals.user = userFound;
        next();
    }
    catch(err){
        next(err);
    }
}

app.get("/userPage/:username", userGet, (req, res) => {
    res.status(200).json(res.locals.user);
})

/* Token Verification */

const tokenVerification = async function(req, res, next){
    if (!req.headers.authorization) return res.status(401).json({message:"Token invalid."});
    try{
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.AUTH_KEY);
        const userFound = await User.findById(verify._id);
        if (!userFound) return res.status(401).json({message:"Token invalid."});
        
        res.locals.ver = verify;
        next();
    }
    catch(err){
        next(err);
    }   
};

app.get("/api/tokenVerify", tokenVerification, (req, res) => {
    res.status(200).json(res.locals.ver.username);
});

/* Posts GET */

app.get("/api/posts", async (req, res, next) => {
    try {
        const chat = await Chat.find();
        return res.status(200).json(chat);
    }
    catch (err) {
        next(err);
    }
});

/* Posts POST */

const handleNewPost = async function(req, res, next) {
    const { username, post } = req.body;

    if (!post || post.length === 0){
        return res.status(401).json({message: "Missing Post!"})
    }

    try{
        const newPost = new Chat({
            username: username,
            post: post,
        });
        await newPost.save();
        res.locals.newPost = newPost;
        next();
    }
    catch(err){
        next(err);
    }
}

app.post("/api/posts", handleNewPost, async (req, res) => {
    res.status(201).json(res.locals.newPost);
});

/* Posts DELETE */

const handleDeletePost = async function(req, res, next) {
    const { _id } = req.params;
    try{
        const postDeleted = await Chat.deleteOne(_id);
        if (!postDeleted) return res.status(200).json({message: "Post already deleted."});
        next();
    }
    catch(err){
        next(err);
    }
}

app.delete("/api/posts", handleDeletePost, (req, res) => {
    res.status(410).json({message: "Post deleted successfully."});
})

/* Error Handling */

app.use((err, req, res, next) => {
    console.error(`Path: ${req.path}`)
    console.error(`Stack ${err.stack}`);

    if (err.code === 11000) {
        return res.status(
            err.status || 400
        ).json({
            error: true,
            message: "Username already used."
        });
    }

    return res.status(
        err.status || 500
    ).json({
        error: true,
        message: err.status < 500 ? err.message : "Internal server error."
    });
});