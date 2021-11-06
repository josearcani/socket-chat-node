const router = require('express').Router();
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth');

const { validateFields, validateJWT } = require('../middlewares');



router.get('/',
  validateJWT,
  renewToken);

router.post('/login', [
  check('email', 'An email is required').isEmail(),
  check('password', 'The password is required').notEmpty(),
  validateFields
], login);

router.post('/google', [
  check('id_token', 'A token is needed').not().isEmpty(),
  validateFields
], googleSignIn);

module.exports = router;
