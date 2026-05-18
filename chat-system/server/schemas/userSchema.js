import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: 4,
        maxLength: 16
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
    },
    banned: {
        _id: false,
        isBanned: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String,
            default: null,
            maxLength: 100
        },
        time: {
            type: Date,
            default: null,
        }
    }
});

userSchema.methods.ban = async function(reason){
    this.banned = true;
    this.reason = reason;
    this.time = Date.now;
    return await this.save();
};

userSchema.methods.passwordCheck = async function(passedPassword){
    return await bcrypt.compare(passedPassword, this.password);
};

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

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