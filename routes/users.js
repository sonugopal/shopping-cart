var express = require('express');
var router = express.Router();
let productHelper=require('../helpers/product_helper')
let userHelper=require('../helpers/user_helper')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
  let cartCount=0
  if(user) {
    cartCount=await productHelper.getCartItems(user._id)
  }
  let productList=await productHelper.getAllProducts()
  res.render('user/products', { products:productList,user,cartCount});
});
router.get('/login',(req,res)=>{
  res.render('login/login',{layout:false})
})

router.get('/signup',(req,res)=>{
  res.render('login/signup',{layout:false})
})
router.post('/signup',(req,res)=>{
  userHelper.doSignup(req.body).then((data)=>{
    req.session.loggedIn=true
    req.session.user=data
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    console.log(response)
    if(response.loginStatus) {
      req.session.loggedIn = true
      req.session.user =response.user
      res.redirect('/')
    }else {
      res.redirect('/login')
    }
  })
})

router.get('/logout',function (req,res,next) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/add-to-cart/:productId',(req,res)=>{
  productHelper.updateCart(req.params.productId,req.session.user._id).then((response)=>{
    res.redirect('/')
  })
})
router.get('/cart',async (req,res,next)=>{
  let userCart=await productHelper.getCartProducts(req.session.user._id)
  console.log(userCart)
  res.render('user/view-cart',{userCart})
})
router.get('/remove-item/:productId',async (req,res,next)=>{
  productHelper.removeCartItem(req.session.user._id,req.params.productId).then(()=>{
    res.redirect('/cart')
  })

})

router.get('/checkout',async (req,res,next)=>{

  let productsCount=await productHelper.getCartItems(req.session.user._id)
  let totalProducts=await productHelper.getCartProducts(req.session.user._id)
  let totalPrice=0
  totalProducts.forEach((pro)=>{
    totalPrice+=pro.price
  })
  console.log('total:',totalPrice)
  res.render('user/checkout',{productsCount,totalPrice})
})
router.post('/checkout',async (req,res,next)=>{
  let user=req.session.user._id
  let address=req.body.address
  let userCart=await productHelper.getCartProductList(user)
  console.log(userCart)
  productHelper.createOrder(user,userCart,address).then(()=>{
    productHelper.clearCart(user).then(()=>{
      res.redirect('/orders')
    })
  })

})
router.get('/orders',async (req,res,next)=>{
  let userOrders=await productHelper.getOrderItems(req.session.user._id)
  res.render('user/view-orders',{userOrders})
})
module.exports = router;

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else {
    res.redirect('/user/login')
  }
}