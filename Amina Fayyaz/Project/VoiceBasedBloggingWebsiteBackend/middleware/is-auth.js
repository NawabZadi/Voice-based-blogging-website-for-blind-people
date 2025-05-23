// importing json web tokens package to decode hashed token sent from client side
const jwt = require('jsonwebtoken');

/**  When added as an argument in the route
 * this middleware function is executed before the request
 * enters in the controller and checks the autorization
 * header that whether it has token embedded init or
 * not. If token is sent and is not manipulated
 * at the client side then it decodes the current
 * user out of it and pass it to the controller
 * else it throws unauthorized error
 */

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    // decoding the token using the secret key
    decodedToken = jwt.verify(token, 'Thisisasecret-password-tercesasisihT');
  } catch (err) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  //storing current user information in the request
  req.userId = decodedToken.userId;
  req.username = decodedToken.name;
  next();
};
