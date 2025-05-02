import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
},
{
    timestamps: true,
});

userSchema.pre("save", async function () {
if(this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
}
});

export const User = mongoose.model('User', userSchema);
