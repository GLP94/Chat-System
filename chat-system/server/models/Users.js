import usersSchema from "../schemas/usersSchema.js"
import mongoose from "mongoose";

const users = mongoose.model("Users", usersSchema);

export default users;