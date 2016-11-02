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

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch docs', err);
    // });

    // db.collection('Todos').find({
    //     _id: new ObjectID('5817fc150b038e619816a24b')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch docs', err);
    // });

    db.collection('Users').find({
        $or: [{
            name: 'Jim'
        }, {
            location: 'Savannah'
        }]
    }).toArray().then((docs) => {
        console.log('Users!');
        pretty.prettyPrint(docs);
        //console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('error: ', err);
    });



    //db.close();

});
