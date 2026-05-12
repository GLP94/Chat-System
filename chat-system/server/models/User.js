import userSchema from "../schemas/userSchema.js"
import mongoose from "mongoose";

const user = mongoose.model("User", userSchema);

export default user;