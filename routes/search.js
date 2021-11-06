const router = require('express').Router();

const { search, searchProductsByCategory } = require('../controllers');

router.get('/:collection/:term', search)

router.get('/:category', searchProductsByCategory)

module.exports = router;