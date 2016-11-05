var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// this is the URI for the database connections
//mongodb://heroku_qz32lbjw:4g8ion60ai0ieq8arfr3akgl8t@ds019856.mlab.com:19856/heroku_qz32lbjw

module.exports = {
    mongoose
};
