const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleHistorySchema = new Schema({
    Version_History : [{
        article : {
            type: Object,
        },
        timeChanged: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('ArticleHistory',articleHistorySchema);