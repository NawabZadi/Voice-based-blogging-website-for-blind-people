const mongoose = require('mongoose');
//amina56
//OVjbZr8ZusfeJv3S

const MONGOOSE_OPTIONS = {
  maxPoolSize: (() => {
    return 10;
  })(),
  autoIndex: true
};

const uri =
  'mongodb+srv://amina56:OVjbZr8ZusfeJv3S@cluster0.fybjx7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connectToDatabase() {
  mongoose.connection.on('connected', function () {
    console.info('Mongoose default connection open to ' + uri);
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.error('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.info('Mongoose default connection disconnected');
  });

  return mongoose.connect(uri);
}

module.exports = connectToDatabase;
