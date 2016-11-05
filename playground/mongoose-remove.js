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

// remove all
// Todo.remove({}).then((result) => {
//     console.log(result);
// });


//Todo.findOneAndRemove({})
//Todo.findByIdAndRemove({})

Todo.findByIdAndRemove('581e076270bdd7ca18671d27').then((todo) => {
    console.log(todo);
});

Todo.findOneAndRemove({
    _id: '581e076270bdd7ca18671d27'
}).then((todo) => {
    console.log(todo);
});
