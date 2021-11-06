const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  
  try {
    
    // verificar que el email existe

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        msg: 'email or password - email'
      })
    }

    // Si la cuenta de usuario esta ACTIVO
    if (!user.state) {
      return res.status(400).json({
        msg: 'email or password - state:false'
      })
    }

    // verificar la contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'email or password - password'
      })
    }

    // generar un JWT
    const token = await generateJWT( user.id );
    res.json( {
      user,
      token
    } )

  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Talk to the administrador'
    })
  }
}

const googleSignIn = async (req = request, res = response) => {

  const { id_token } = req.body;

  try {
      const { name, email, img } = await googleVerify( id_token );
    
      let user = await User.findOne({ email });

      // registar si no lo encuentra
      if (!user) {

        const data = {
          name,
          email,
          password: ':P',
          img,
          google: true,
        }

        user = new User( data );
        // console.log(user)
        await user.save();
      }

      // es una cuenta activa?
      if (!user.state) {
        return res.status(401).json({
          msg: 'Contanct the admin, user blocked'
        })
      }
      
      // generar un JWT
      const token = await generateJWT( user.id );

      res.json({
        user,
        token,
      })
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Google token not valid'
    })
  }
}

const renewToken = async (req = request, res = response) => {
  const { user } = req; // user available when token is valid
  const token = await generateJWT( user.id ); // renew a token

  res.json({
    user,
    token,
  });
}

module.exports = {
  login,
  googleSignIn,
  renewToken,
}