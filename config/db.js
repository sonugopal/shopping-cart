/*
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
}*/

var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
};

module.exports.connect = function (done) {
    if (state.db) return done();


    const url = 'mongodb://localhost:27017';

// Database Name
    const dbName = 'shopping';

// Create a new MongoClient
    const client = new MongoClient(url,{ useNewUrlParser: true ,useUnifiedTopology: true});


// Use connect method to connect to the Server
    client.connect(function(err) {
        if (err) return done(err);
        //assert.equal(null, err);
        console.log("Connected successfully to Database");

        const dbs = client.db(dbName);
        state.db=dbs;
        //done();
    });

    done();

};

module.exports.get = function () {
    return state.db;
};