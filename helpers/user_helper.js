let db = require('../config/db').connect()
let COLLECTIONS = require('../config/db_collections')
const ObjectID = require('mongodb').ObjectID
const bcrypt = require('bcrypt');
module.exports = {
    doSignup: async (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, saltRounds)
            db._W.collection(COLLECTIONS.USERS).insertOne(userData).then((err, data) => {
                if (!err) {
                    resolve(data.ops[0])
                }
            })
        })
    }
}