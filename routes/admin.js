var express = require('express');
var router = express.Router();
let productHelper=require('../helpers/product_helper')
    //const fileupload = require('fileupload').createFileUpload('./public/product-images/')
const fs=require('fs')
/* GET home page. */
router.get('/', async function(req, res, next) {
  res.redirect('/admin/all-products')
});
router.get('/all-products', async function(req, res, next) {
  let productList=await productHelper.getAllProducts()
  console.log(productList)
  res.render('admin/view-products', { admin:true,products:productList});
});
router.get('/add-product', async function(req, res, next) {
  res.render('admin/add-products', { admin:true});
});
router.post('/add-product', async function(req, res, next) {
  let addProduct=productHelper.addProduct(req.body)
  addProduct.then((product)=>{
    let image=req.files.image
    image.mv('./public/product-images/'+product._id+'.jpg',(err)=>{
      if(!err) {
        res.redirect('/admin')
      }else {
        console.log(err)
      }
    })
  })
});
router.get('/delete-product/:id',async (req,res)=>{
  let proID=req.params.id
  productHelper.deleteProduct(proID).then((response)=>{
    if(response){
      fs.unlink('./public/product-images/'+proID+'.jpg', function() {
        res.redirect('/admin')
      });
    }
  })

})

module.exports = router;
