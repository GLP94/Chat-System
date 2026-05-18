import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    post: {
        type: String,
        required: true,
        maxLength: 1000
    },
    username: String,
    time: {
        type: Date,
        default: Date.now
    }
});

export default chatSchema