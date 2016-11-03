const {
    ObjectID
} = require('mongodb');

const {
    mongoose
} = require('../server/db/mongoose');

const {
    Todo
} = require('../server/models/todo');

const {
    User
} = require('../server/models/user');


var id = '581b44fe62940bd18f1e5cb3';

var userId = '581aa17d23112b6d8bc9af03';
var notFoundUserId = '681aa17d23112b6d8bc9af03';
var inValidUserId = '581aa17d23112b6d8bc9af0311';



// if (!ObjectID.isValid(id)) {
//     console.log('That object id is not valid', id);
// } else {

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((doc) => {
//     console.log('Todo', doc);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('id not found');
//     }
//     console.log('Todo by id', todo);
// }).catch((e) => console.log(e));

User.findById(userId).then((user) => {
    console.log('Find User by Id', user);
}).catch((e) => console.log(e));

User.findById(notFoundUserId).then((user) => {
    if (!user) {
        return console.log('That user is not found', notFoundUserId);
    }
    console.log('Find User by Id', user);
}).catch((e) => console.log(e));

User.findById(inValidUserId).then((user) => {
    if (!user) {
        return console.log('That user is not found', notFoundUserId);
    }
    console.log('Find User by Id', user);
}).catch((e) => console.log(e));

// }
