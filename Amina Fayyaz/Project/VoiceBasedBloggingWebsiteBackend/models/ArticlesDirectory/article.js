const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  Title: {
    type: String,
    required: true
  },
  PostedOn: {
    type: Date,
    default: Date.now
  },
  Body: {
    type: String
  },
  Author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    authorName: String
  },
  Comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  Likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Article', articleSchema);
