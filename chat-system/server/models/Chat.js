import chatSchema from "../schemas/chatSchema.js"
import mongoose from "mongoose";

const chat = mongoose.model("Chat", chatSchema);

export default chat;