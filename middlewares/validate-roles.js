const { request } = require('express');

const isAdmin = (req, res = request, next) => {

  if (!req.user) {
    return res.status(500).json({
      msg: 'cannot validate role without a valid token'
    })
  }

  const { role, name } = req.user;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name} is not admin - does not have enough privilegies`
    })
  }

  next();

}

const hasRole = ( ...roles ) => {
  // spread o resto crea un array de los parametros

  return (req, res = request, next) => {

    if (!req.user) {
      return res.status(500).json({
        msg: 'cannot validate role without a valid token'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `The service require one of these roles: ${roles}`
      })
    }

    next();
  }

}

module.exports = {
  isAdmin,
  hasRole
}