const router = require('express').Router();
const { body, check, param } = require('express-validator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

const { idProductExists, productExits, categoryExists } = require('../helpers/db-validators');

const { validateFields, validateJWT, isAdmin } = require('../middlewares');

router.get('/', getProducts)

router.get('/:id', [
  param('id', 'it is not a valid Mongo ID').isMongoId(),
  check('id').custom(idProductExists),
  validateFields
], getProduct)

router.post('/', [
  validateJWT,
  body('name', 'A name is required').not().isEmpty(),
  body('name').custom(productExits),
  body('category', 'It is not a valid mongo id').isMongoId(),
  body('category').custom(categoryExists),  
  validateFields
], createProduct)

router.put('/:id', [
  validateJWT,
  param('id', 'it is not a valid Mongo ID').isMongoId(),
  check('id').custom(idProductExists),
  body('category', 'It is not a valid mongo id').isMongoId(),
  body('category').custom(categoryExists),  
  validateFields
], updateProduct)

router.delete('/:id', [
  validateJWT,
  isAdmin,
  param('id', 'it is not a avalid Id').isMongoId(),
  param('id').custom(idProductExists),
  validateFields
], deleteProduct)

module.exports = router;