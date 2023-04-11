import mongoose from "mongoose";

const  CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
        unique: false
    },
}, {
    timestamps: true,
})

export default mongoose.model('Comment',CommentSchema)