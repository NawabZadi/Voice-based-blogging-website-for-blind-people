//importing dependencies
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcryptjs');
//initializing express server
const app = express();
const User = require('./models/User/user');
const Profile = require('./models/User/profile');

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

//configuration for REST API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//Error Handling
app.use((error, req, res, next) => {
  //console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

//=======================//
//==================// MULTER CONFIGURATION  //============================//
//=======================//

var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

app.use(
  multer({ storage: storage, fileFilter: imageFilter }).single('picture')
);

//=======================//
//==================//         END           //============================//
//=======================//

//=======================//
//==================// ROUTES CONFIGURATION  //============================//
//=======================//

const articleRoutes = require('./routes/ArticlesDirectory/article');
app.use(articleRoutes);

const authenticationRoutes = require('./routes/User/is-auth');
app.use(authenticationRoutes);

const commentRoutes = require('./routes/ArticlesDirectory/Comment/comment');
app.use(commentRoutes);

const replyRoutes = require('./routes/ArticlesDirectory/Comment/reply');
app.use(replyRoutes);

const userRoutes = require('./routes/User/user');
app.use(userRoutes);

const textEditorRoutes = require('./routes/TextEditor/text_editor');
const connectToDatabase = require('./db');
app.use(textEditorRoutes);

//=======================//
//==================//         END           //============================//
//=======================//

connectToDatabase()
  .then(async (result) => {
    app.listen(8000);
    console.log('connected to the sever', result);
    const user = await User.findOne({ Email: 'admin@gmail.com' });
    if (!user) {
      const password = await bcrypt.hash('admin', 12);
      const profile = new Profile({
        // creating new user profile for the new user with default image as profile dp
        PersonalDescription: 'No Description Added Yet',
        ProfilePhotoSecureId:
          'https://i.pinimg.com/736x/43/30/da/4330da45e2f3a808092cced2543b35c5.jpg',
        ProfilePhotoPublicId: null
      });
      await profile.save();
      const user = new User({
        Email: 'admin@gmail.com',
        Password: password,
        Username: 'admin',
        IsAdmin: true,
        profile: profile._id
      });
      user.save();
    }
  })
  .catch((error) => {
    console.log(error);
  });
