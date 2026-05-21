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
        reason: {
            type: String,
            default: null,
            maxLength: 100
        },
        time: {
            type: Date,
            default: null,
            required: true
        }
    },
    role: {
        type: String,
        default: "User"
    }
});

userSchema.methods.isBanned = async function(){
    return !!this.banned.time;
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
        expiresIn: "7day"
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