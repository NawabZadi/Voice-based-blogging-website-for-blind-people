const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    Text: {
        type: String,
        minlength: 1
    },
    PostedOn: {
        type: Date,
        default: Date.now
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    Replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply"
        }
    ],
    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Comment', commentSchema);