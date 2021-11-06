const { response } = require("express");
const { Product, Category } = require('../models');

// get products
const getProducts = async (req, res = response) => {
  
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [ total, products ] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  })
}

// get product
const getProduct = async (req, res = response) => {

  const { id } = req.params;

  const product = await Product.findById( id )
      .populate('user', 'name')
      .populate('category', 'name');

  res.json(product)
}

// create product
const createProduct = async (req, res = response) => {
  
  const {
    state,
    user,
    ...body
  } = req.body;

  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  }

  const product = new Product(data);

  await product.save();

  res.status(201).json(product);

}

// update product
const updateProduct = async (req, res = response) => {

  const { id } = req.params;
  const {
    state,
    user,
    ...data
  } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.json(product);
}

// delete product
const deleteProduct = async (req, res = response) => {
  
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, {state: false}, { new: true })

  res.json(product)
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}