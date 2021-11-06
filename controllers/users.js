const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');


const getUsers = async (req = request, res = response) => {  
  // const { fname, lname, page = 1 } = req.query;

  const { limit = 5, from = 0} = req.query

  const query = { state: true };

  const [ total, users ] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(from))
      .limit(Number(limit))
  ]);

  res.json({ total, users });
}

const postUsers = async (req, res = response) => {
  const { name, email, password, role } = req.body;

  const user = new User({ name, email, password, role });

  // hashing the password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  user.password = hash;

  // save to db
  await user.save();
  
  res.json( user );
}

const putUsers = async (req, res = response) => {
  const { id } = req.params;

  const { _id, password, google, email, ...data } = req.body;

  // asumo que quiere actualizar password
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, data, { new: true })

  res.json( user );
}

const patchUsers = (req, res = response) => {
  
  res.json({
    msg: 'patch API - controller'
  });
}

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  // Borrar fisicamente No recomendado
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, { state: false }, { new: true });

  res.json(user);
}

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
};
