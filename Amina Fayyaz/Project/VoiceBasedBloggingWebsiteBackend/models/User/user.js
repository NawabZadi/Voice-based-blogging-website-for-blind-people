const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  Username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  IsAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  Profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile'
  },
  Encodings: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('User', userSchema);
