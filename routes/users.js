var express = require('express');
var router = express.Router();
let productHelper=require('../helpers/product_helper')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let productList=await productHelper.getAllProducts()
  console.log(productList)
  res.render('user/products', { products:productList});
});

module.exports = router;
