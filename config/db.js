var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Promise=require("promise")
module.exports= {
    connect:function() {
        return new Promise(function (resolve,reject) {
            let dbo
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                console.log("Mongodb connected")
                dbo = db.db("shopping");
                //console.log(dbo)
                resolve(dbo)

            });
        })

    }
}