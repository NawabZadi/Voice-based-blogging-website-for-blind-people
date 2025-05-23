const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    PersonalDescription: {
        type: String, 
        minlength: 10,
        maxlength: 5000
    },
    ProfilePhotoSecureId : {
        type: String,
    },
    ProfilePhotoPublicId : {
        type: String
    },
    // /*UserActivity : [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref : "UserActivity"
    //     }
    // ]*/
});

module.exports = mongoose.model('UserProfile',profileSchema);