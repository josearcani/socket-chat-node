// const { Router } = require('express');
// const router = Router();
// localhost:4000/api/users

const router = require('express').Router();

const { 
  validateFields,
  validateJWT,
  isAdmin,
  hasRole
} = require('../middlewares');

const { check, body, param } = require('express-validator');

const { validRole, emailExists, idUserExists } = require('../helpers/db-validators');

const { getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  patchUsers } = require('../controllers/users');

router.get('/', getUsers)

router.post('/', [
  body('name', 'The name is required').not().isEmpty(),
  body('email', 'It is not a valid email').isEmail(),
  body('email').custom(emailExists),
  body('password', 'The password must have 6 characters').isLength({ min: 6 }),
  // body('role', 'The role is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  body('role').custom(validRole),
  validateFields
], postUsers)

router.put('/:id',[
  param('id', 'It is not a valid ID').isMongoId(),
  param('id').custom(idUserExists),
  body('role').custom(validRole),
  validateFields
], putUsers)

router.patch('/', patchUsers)

router.delete('/:id',[
  validateJWT,
  // isAdmin,
  hasRole('ADMIN_ROLE', 'OTHER_ROLE', 'SALES_ROLE'),
  param('id', 'It is not a valid ID').isMongoId(),
  param('id').custom(idUserExists),
  validateFields
], deleteUsers)

module.exports = router;
