let db=require('../config/db').connect()
let COLLECTIONS=require('../config/db_collections')
const ObjectID = require('mongodb').ObjectID

module.exports={
    addProduct:(details)=>{
        return new Promise(async (resolve)=>{
            let product={
                name:details.Name,
                price:details.Price,
                description:details.Description
            }
            let newProduct=await db._W.collection(COLLECTIONS.PRODUCT).insertOne(product)
            if(newProduct) resolve(newProduct.ops[0])
        })
    },
    getAllProducts:()=> {
        return new Promise(async (resolve) => {
            let products=await db._W.collection(COLLECTIONS.PRODUCT).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(id)=> {
        return new Promise(async (resolve) => {
            db._W.collection(COLLECTIONS.PRODUCT).removeOne({_id:ObjectID(id)},(err,data)=>{
                if(!err) resolve(true)
            })

        })
    }
}