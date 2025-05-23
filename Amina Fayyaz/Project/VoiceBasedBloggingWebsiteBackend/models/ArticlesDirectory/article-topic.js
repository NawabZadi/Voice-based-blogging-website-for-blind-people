const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleTopicSchema = new Schema ({
    TopicName : {
        type: String,
        required: true
    },
    PictureSecureId : {
        type: String
    },
    PicturePublicId: {
        type: String
    },
    Description : {
        type: String
    }
});

module.exports = mongoose.model('ArticleTopic',articleTopicSchema);