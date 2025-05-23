const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userActivitySchema = new Schema ({
    ActivityTime : {
        type: Date,
        default: Date.now
    },
    Link : {
        type: String
    }
});

module.exports = mongoose.model('UserActivity',userActivitySchema);