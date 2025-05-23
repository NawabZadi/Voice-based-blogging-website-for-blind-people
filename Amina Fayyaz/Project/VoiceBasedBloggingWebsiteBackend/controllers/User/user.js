const Profile = require("../../models/User/profile");
const User = require("../../models/User/user");

//Cloudinary configuration
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dkj3d1vvs',
    api_key: "759763123283575",
    api_secret: '_px1mRCmIfA-b8bgz9NADudJCHY'
});


/**
 * controller function to get the user profile by their id. 
 * The id is provided in the url of the request as a parameter. 
 */
exports.getUserProfile = (req,res,next) => {
    const userId = req.params.id;
    let username = null;

    User.findById(userId)
    .then(user => { // find the user
        if (!user) { // if the user doesn't exist, send back error 404 not found
            return res.status(404).json({
                message: "User not found!"
            });
        }
        username = user.Username;
        return Profile.findById(user.Profile); // return user profile in the next then block
    })
    .then(userProfile => {
        res.status(201).json({ // return profile data in json format to the client
            message: "User Profile Fetched Successfully",
            userProfile: userProfile,
            userId : userId,
            username: username
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


/**
 * controller function which makes use of auth middleware
 * to get the current user information and returns the 
 * current user profile information. 
 */
exports.getCurrentUserProfile = (req,res,next) => {
    User.findById(req.userId) // if there's a user in the request then find the user in the db 
    .then(user => {
        if (!user) { // if there's no such user send back the error response code 404 
            return res.status(404).json({ 
                message: "User not found!"
            });
        }
        return Profile.findById(user.Profile); // if profile exists then find it and return to the next then block
    })
    .then(userProfile => {
        res.status(201).json({ // sending client profile of the current user encoded in the json object 
            message: "Current User Profile Fetched Successfully",
            userProfile: userProfile,
            userId : req.userId
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}


/**
 * controller function to upload a new profile picture or update it. 
 * It makes use of cloudinary API to store the profile picture on the 
 * cloud instead of storing it locally. 
 */
exports.uploadProfilePicture = (req,res,next) => {

    let secure_url = null;
    let public_id = null;

    console.log(req.file);

    // uploading the image on the cloud
    cloudinary.v2.uploader.upload(req.file.path,
        { folder: "profile/"+req.userId+"/"+"dp/",type:"private"},
        (error,result)=>{
            if (error) {
                return res.status(500).json({
                    message: "Failed to uplaod image"
                });
            }
            //stroing returned url and id of the image
            secure_url = result.secure_url;
            public_id = result.public_id;

            User.findById(req.userId)
                .then(user => {
                    if (!user) {
                        return res.status(404).json({
                            message: "User not found!"
                        });
                    }
                    return Profile.findById(user.Profile);
                })
                .then(userProfile=> { // saving url and id of the image in the user profile
                    userProfile.ProfilePhotoSecureId = secure_url;
                    userProfile.ProfilePhotoPublicId = public_id;

                    return userProfile.save(); //saving user profile
                }) 
                .then(savedUserProfile => {
                    res.status(201).json({
                        message: "User Profile Picture Updated",
                        picture: savedUserProfile.ProfilePhotoSecureId
                    })
                })
                .catch(err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        });

}


/**
 * controller function to upload the description of the user 
 * in this profile. this uploads new as well as updates the 
 * description.
 */
exports.uploadDescription = (req,res,next) => {
    User.findById(req.userId)
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }
        return Profile.findById(user.Profile);
    })
    .then(userProfile=> {
        userProfile.PersonalDescription = req.body.description;
        return userProfile.save();
    }) 
    .then(savedUserProfile => {
        res.status(201).json({
            message: "User Profile Description Updated Successfully",
            description: savedUserProfile.PersonalDescription
        })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}