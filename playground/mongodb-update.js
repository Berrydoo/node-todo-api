//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

const pretty = require('./util');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {

    if (error) {
        return console.log('Unable to connect to MongoDB server ' + error);
    }
    console.log('Connected to MongoDB Server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('581a476570bdd7ca18671d21')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    // 5817fd4bea6c3e61a7de4f0e

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5817fd4bea6c3e61a7de4f0e')
    }, {
        $set: {
            name: 'Elizabeth'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


    //db.close();

});
