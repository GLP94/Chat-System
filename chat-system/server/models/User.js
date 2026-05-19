import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

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
    this.banned.isBanned = true;
    this.banned.reason = reason;
    this.banned.time = Date.now;
    return await this.save();
};

userSchema.methods.passwordCheck = async function(passedPassword){
    return await bcrypt.compare(passedPassword, this.password);
};

userSchema.methods.authentication = function(){

    const user = {
        _id: this._id,
        username: this.username
    };

    const token = jwt.sign(user, process.env.AUTH_KEY, {
        expiresIn: "2 days"
    });

    return token;
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

export default mongoose.model("User", userSchema);