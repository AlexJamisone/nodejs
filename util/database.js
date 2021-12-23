const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://rootjam:9Fbav1XY5amuwjEX@cluster0.haxu3.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client =>{
        console.log('You have success conection to MongoDB');
        _db = client.db()
        callback()
    })
    .catch(err => {
        console.log(err)
        throw err
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No Database Found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;