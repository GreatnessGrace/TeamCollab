import mongoose, { Types } from "mongoose";
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
        enum: ["user", "admin", "manager"],
        default: "user",
    },
    teams: [{ type: Types.ObjectId, ref: 'Team' }],
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
