const search = require('./search');
const auth = require('./auth');
const products = require('./products');
const categories = require('./categories');
const users = require('./users');
const uploads = require('./uploads');

module.exports = {
  ...search,
  ...auth,
  ...products,
  ...categories,
  ...users,
  ...uploads,
}