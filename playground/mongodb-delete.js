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

    // deleteMany users
    db.collection('Users').deleteMany({
        name: 'Sarah'
    }).then((result) => {
        console.log(result);
    });

    // findOneAndDelete by ObjectID
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5817ff9ff5452861c5d682aa')
    }).then((result) => {
        pretty.prettyPrint(result);
    })

    // deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result.result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    //db.close();

});
