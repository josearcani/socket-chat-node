const {
  Category,
  Product,
  Role,
  User,
} = require('../models');
// const Role = require('../models/role');
// const User = require('../models/user');

const validRole = async (role = '') => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`The ${role} role is not registered`);
  }
}

//validate the email
const emailExists = async (email = '') => {
  // const { email } = req.body;
  const data = await User.findOne({ email });
  if (data) {
    throw new Error(`The ${email} email exists already`);
  }
}

const idUserExists = async (id = '') => {
  const data = await User.findById( id );
  if (!data) {
    throw new Error(`The mongo ${id} does not exists`);
  }
}

// validation for categories
const categoryExists = async (id = '') => {
  const data = await Category.findById( { _id: id } );
  if (!data) {
    throw new Error(`The id ${id} does not exist`)
  }
}

// validation for products
const idProductExists = async (id = '') => {
  const data = await Product.findById( id );
  if (!data) {
    throw new Error(`The id ${id} does not exist`)
  }
}

const productExits = async (name1 = '') => {
  let name = name1.toUpperCase();
  const data = await Product.findOne({ name });
  if (data) {
    throw new Error(`The product ${name} exist already`)
  }
}

/* validamos que la colletion sea una válida por lo mandado desde routes */
const allowedCollections = (collection = '', collections = []) => {
  const isAllowed = collections.includes(collection);
  if (!isAllowed) {
    throw new Error(`The colletion ${collection} is not allowed. ${collections}`)
  }
  return true;
}

module.exports = {
  validRole,
  emailExists,
  idUserExists,
  categoryExists,
  idProductExists,
  productExits,
  allowedCollections,
}