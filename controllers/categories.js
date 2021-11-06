const { response } = require("express");
const { Category } = require("../models");

// get categories
const getCategories = async (req, res = response) => {

  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  const [ total, categories ] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', 'name')
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  })
}

// get category
const getCategory = async (req, res = response) => {
  const { id } = req.params;

  //buscar en DB
  const category = await Category.findById(id).populate('user', 'name');

  res.json({
    category
  })
}

// create category
const createCategory = async (req, res = response) => {

  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    res.status(400).json({
      msg: `The category ${name} exists already`
    })
  }

  const data = {
    name,
    user: req.user._id,
  }

  const category = new Category( data )

  await category.save();

  res.status(201).json(category);
}

// update category
const updateCategory = async (req, res = response) => {
  
  const { id } = req.params;
  const { user, state, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  
  res.json({
    category
  })
}
// delete category
const deleteCategory = async (req, res = response) => {
  
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate( id, { state: false }, { new: true })
  
  res.json(category)
}
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}