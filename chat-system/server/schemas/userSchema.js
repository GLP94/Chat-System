import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        min: 4,
        max: 16
    },
    password: {
        type: String,
        unique: true,
        required: true,
        min: 4,
        max: 100
    }
});

userSchema.pre("save", async function(next) {
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch(err){
        next(err);
    }
});

export default userSchema