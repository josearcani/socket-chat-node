const { request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res, next) => {
  // en el header el token se llama x-token
  const token = req.header('x-token');

  // console.log(token);

  // si existe el token
  if (!token) {
    return res.status(401).json({
      msg: 'There is no token in the request'
    })
  }

  // verificamos que sea un token válido

  try {
    // si no es válido lanza un error cpturado por catch
    const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);

    // verificar que uid corresponde a un usuario
    const user = await User.findById( uid );
    //console.log(payload); // contiene los datos uid, iat, exp
    

    // verificar que el user existe
    if (!user) {
      return res.status(401).json({
        msg: 'Token not valid - user does NOT exists'
      })
    }


    //verificar que user sea state: true
    if (!user.state) {
      return res.status(401).json({
        msg: 'Token not valid - user.state: false'
      })
    }
    
    // req.uid = uid;
    // si es válido continua con el siguiente middleware
    req.user = user;

    next();
  } catch (error) {
    // console.log(error)
    res.status(401).json({
      msg: 'Token not valid'
    })
  }
}

module.exports = {
  validateJWT,
}