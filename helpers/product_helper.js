let db = require('../config/db')
let COLLECTIONS = require('../config/db_collections')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    addProduct: (details) => {
        return new Promise(async (resolve) => {
            let product = {
                name: details.Name,
                price: details.Price,
                description: details.Description
            }
            let newProduct = await db.get().collection(COLLECTIONS.PRODUCT).insertOne(product)
            if (newProduct) resolve(newProduct.ops[0])
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve) => {
            let products = await db.get().collection(COLLECTIONS.PRODUCT).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (id) => {
        return new Promise(async (resolve) => {
            db.get().collection(COLLECTIONS.PRODUCT).removeOne({_id: ObjectID(id)}, (err, data) => {
                if (!err) resolve(true)
            })

        })
    },
    updateCart: (productId, userId) => {
        return new Promise(async (resolve) => {
            const userCart = await db.get().collection(COLLECTIONS.CART).findOne({user: ObjectID(userId)})
            if (!userCart) {
                const cart = {
                    user: ObjectID(userId),
                    products: [ObjectID(productId)]
                }
                db.get().collection(COLLECTIONS.CART).insertOne(cart, (err, done) => {
                    console.log(done)
                    resolve()
                })
            } else {
                db.get().collection(COLLECTIONS.CART)
                    .updateOne({user: ObjectID(userId)}, {$push: {products: ObjectID(productId)}}, (err, done) => {
                        if (!err) {
                            resolve()
                        }
                    })
            }
        })
    },
    getCartItems: (userId) => {
        return new Promise(async (resolve) => {
            let cart = await db.get().collection(COLLECTIONS.CART)
                .aggregate([{$match: {user: ObjectID(userId)}},
                    {
                        $project: {products: 1, _id: 0}
                    }]).toArray()
            console.log(cart)
            let count=0
            if(cart[0]){
                count=cart[0].products.length
            }
            resolve(count)
        })
    },
    getCartProducts: (userId) => {

        return new Promise(async (resolve) => {
            console.log(userId)
            let cart = await db.get().collection(COLLECTIONS.CART)
                .aggregate([{$match: {user: ObjectID(userId)}},
                    {
                        $lookup:{
                            from:COLLECTIONS.PRODUCT,
                            let:{product:'$products'},
                            pipeline:[{
                                $match:{$expr:{$in:['$_id','$$product']}}
                            }],
                            as:'productDetails'
                        }
                    },{$project:{productDetails:1,_id:0}}]).toArray()
            console.log(cart)
            if(cart[0]) resolve(cart[0].productDetails)
            else resolve(null)
        })
    },
    removeCartItem:(user,product)=>{
        return new Promise(async (resolve)=>{
            let removeItem=await db.get().collection(COLLECTIONS.CART)
                .updateOne({user:ObjectID(user)},{$pull:{products:ObjectID(product)}})
            if(removeItem){
                resolve()
            }
        })
    },
    getCartProductList:(user)=>{
      return new Promise(async (resolve)=>{
          let cart=await db.get().collection(COLLECTIONS.CART).findOne({user:ObjectID(user)})
          if(cart){
              resolve(cart.products)
          }else{
              resolve(null)
          }
      })
    },
    createOrder:(user,products,address)=>{
        return new Promise(async (resolve)=>{
            let order={
                user:ObjectID(user),
                products:products,
                time_stamp:new Date(),
                address: address
            }

            db.get().collection(COLLECTIONS.ORDERS).insertOne(order).then((done)=>{
                resolve()
            })
        })
    },
    clearCart:(user)=>{
        return new Promise((resolve)=>{
            db.get().collection(COLLECTIONS.CART).removeOne({user:ObjectID(user)}).then((done)=>{
                resolve()
            })
        })
    },
    getOrderItems: (userId) => {
        return new Promise(async (resolve) => {
            let cart = await db.get().collection(COLLECTIONS.ORDERS)
                .aggregate([{$match: {user: ObjectID(userId)}},
                    {
                        $lookup:{
                            from:COLLECTIONS.PRODUCT,
                            let:{product:'$products'},
                            pipeline:[{
                                $match:{$expr:{$in:['$_id','$$product']}}
                            }],
                            as:'productDetails'
                        }
                    }]).toArray()
            console.log(cart)
            resolve(cart)
        })
    }
}