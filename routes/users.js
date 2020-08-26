var express = require('express');
var router = express.Router();
let productHelper=require('../helpers/product_helper')
let userHelper=require('../helpers/user_helper')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let productList=await productHelper.getAllProducts()
  console.log(productList)
  res.render('user/products', { products:productList});
});
router.get('/login',(req,res)=>{
  res.render('login/login',{layout:false})
})

router.get('/signup',(req,res)=>{
  res.render('login/signup',{layout:false})
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((user)=>{
    req.session.loggedIn=true
    req.session.user=user
  })
})
module.exports = router;
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else {
    res.redirect('/user/login')
  }
}