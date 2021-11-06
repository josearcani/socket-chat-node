const jwt = require('jsonwebtoken');
const User = require('../models/user');

const generateJWT = ( uid = '' ) => {
  // jwt no soporta promesas,creémos una
  return new Promise((resolve, reject) => {

    const payload = { uid };

    jwt.sign( payload, process.env.SECRET_PRIVATE_KEY, {
      expiresIn: '30m'
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject('Not possible to signature a new token');
      } else {
        resolve(token);
      }
    });
  })
}

// to verify token sent to the server by the browser
const checkJWT = async (token = '') => {

  try {
    if (token.length < 10) {
      return null
    }

    const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
    const user = await User.findById( uid );

    if (user) {
      if (user.state) {
        return user;
      } else {
        return null
      }
    } else {
      return null;
    }
  } catch (error) {
    return null
  }
}

module.exports = {
  generateJWT,
  checkJWT,
}