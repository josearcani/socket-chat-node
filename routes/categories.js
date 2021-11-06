const router = require('express').Router();
const { check, body, param } = require('express-validator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');

const { categoryExists } = require('../helpers/db-validators');

const {
  validateJWT,
  validateFields,
  isAdmin
} = require('../middlewares');

// Get all categories
router.get('/', getCategories)

// Get a single category
router.get('/:id',[
  param('id', 'it is not a avalid Id').isMongoId(),
  check('id').custom(categoryExists),
  validateFields
], getCategory)

// Create a category - token
router.post('/', [
  validateJWT,
  body('name', 'A name is required').not().isEmpty(),
  validateFields
], createCategory)

// Update a category
router.put('/:id',[
  validateJWT,
  param('id', 'it is not a avalid Id').isMongoId(),
  check('id').custom(categoryExists),
  body('name', 'A new name is needed to update').isLength({ min: 3 }),
  validateFields
], updateCategory)

// Delete a category
router.delete('/:id', [
  validateJWT,
  isAdmin,
  param('id', 'it is not a avalid Id').isMongoId(),
  check('id').custom(categoryExists),
  validateFields
], deleteCategory)

module.exports = router;