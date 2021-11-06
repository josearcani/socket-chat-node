const { response } = require("express")
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product} = require('../models')

const allowedCollections = [
  'users',
  'products',
  'categories',
  'roles',
];

// busqueda de usuario por mongoID o nombre
const searchUsers = async (term = '', res = response) => {
  const isMongoId = ObjectId.isValid(term); // boolean if is mongoid

  if (isMongoId) {
    const user = await User.findById(term);

    return res.json({
      results: user ? [ user ] : []
    });
  }

  // terms puede ser name o email
  const regex = new RegExp(term, 'i'); // case insensitive

  const [count, users] = await Promise.all([
    User.count({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    }),
    User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    })
  ])

  res.json({
    total: count,
    results: users
  });
}

// busieda de productos cauca, sprite, fanta, coffee & ron
const searchProducts = async (term = '', res = response) => {

  if (term == 'all') {
    const [ count, products ] = await Promise.all([
      Product.count({ state: true }),
      Product.find({ state: true }).populate('category', 'name'),
    ]);
    return res.json({
      total: count,
      result: products
    })
  }

  const isMongoId = ObjectId.isValid(term); // boolean if is mongoid

  if (isMongoId) {
    const product = await Product.findById(term).populate('category', 'name');

    return res.json({
      results: product ? [ product ] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const [ count, products ] = await Promise.all([
    Product.count({ name: regex, state: true }),
    Product.find({ name: regex, state: true }).populate('category', 'name'),
  ]);

  res.json({
    total: count,
    result: products
  });

}

// busqueda de categorias drinks, cakes, warm
const searchCategories = async (term = '', res = response) => {

  if (term == 'all') {
    const [ count, categories ] = await Promise.all([
      Category.count(),
      Category.find(),
    ]);
    return res.json({
      total: count,
      result: categories
    })
  }

  const isMongoId = ObjectId.isValid(term); // boolean if is mongoid

  if (isMongoId) {
    const category = await Category.findById(term);

    return res.json({
      results: category ? [ category ] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const category = await Category.find({ name: regex });

  res.json({
    results: category
  })
}

const search = (req, res = response) => {

  const {collection, term} = req.params;

  // si no existe la colleción que buscan
  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The collections allowed are ${allowedCollections}`
    })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    case 'categories':
      searchCategories(term, res);
      break;
    default:
      res.status(500).json('Sorry, collections under constructions :P');
  }
}

const searchProductsByCategory = async (req, res = response) => {
  
  const { category } = req.params;
  
  const isMongoId = ObjectId.isValid(category); // boolean if is mongoid

  if (isMongoId) {
    const [ count, products ] = await Promise.all([
      Product.count({ category: ObjectId(category) }),
      Product.find({ category: ObjectId(category) })
              .populate('category', 'name'),
    ]);

    return res.json({
      total: count,
      results: products ? [ products ] : []
    });
  }
  // como hcaer que con el nombre de la categoria obtener todos
  // los productos a los que pertenece 
  // const regex = new RegExp(category, 'i');
  // const products = await product.find({})
  res.json('no es un id valido');
}

module.exports = {
  search,
  searchProductsByCategory,
}