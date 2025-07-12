import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    username: string
    email: string
    password: string
    college: string
    skills: string[]
    bio?: string
    avatarUrl?: string
    connections: mongoose.Types.ObjectId[]
    incomingRequests: mongoose.Types.ObjectId[]
    outgoingRequests: mongoose.Types.ObjectId[]
    isVerified: boolean
    otp?: string
    otpExpiry?: Date
    createdAt: Date
    canTeach: boolean
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    college: {
        type: String,
        required: [true, "College is required"],
    },
    skills: {
        type: [String],
        default: [],
    },
    bio: {
        type: String
    },
    avatarUrl: {
        type: String
    },
    connections: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    incomingRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    outgoingRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        select: false
    },
    otpExpiry: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    canTeach: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default UserModel;