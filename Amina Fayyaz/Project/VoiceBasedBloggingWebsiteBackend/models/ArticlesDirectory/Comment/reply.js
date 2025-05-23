const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
    Text: {
        type: String,
        minlength: 1
    },
    Author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    RepliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    PostedOn: {
        type: Date,
        default: Date.now
    },
    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model('Reply', replySchema);