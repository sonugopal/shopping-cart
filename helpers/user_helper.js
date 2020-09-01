let db = require('../config/db')
let COLLECTIONS = require('../config/db_collections')
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
    doSignup: async (userData) => {
        return new Promise(async (resolve) => {
            userData.password = await bcrypt.hash(userData.password, saltRounds)
            db.get().collection(COLLECTIONS.USERS).insertOne(userData).then((data,err) => {
                if (!err) {
                    resolve(data.ops[0])
                }else {
                    throw err
                }
            })
        })
    },
    doLogin: async (loginData) => {
        return new Promise(async (resolve)=>{
            let result={}
            let validPassword

            const user=await db.get().collection(COLLECTIONS.USERS).findOne({email: loginData.email})

            if(!user){
                result.loginStatus=false
            }else{
                validPassword=await bcrypt.compare(loginData.password,user.password)
                if(!validPassword){
                    result.loginStatus=false
                }else {
                    result.user=user
                    result.loginStatus=true
                }
            }
            resolve(result)

        })
    }

}
updateCart:(productId,userId)=>{
    return new Promise(async (resolve)=> {


    })
}
