require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {
    ObjectID
} = require('mongodb');

var {
    mongoose
} = require('./db/mongoose');

var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

var {
    authenticate
} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, resp) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        resp.send(doc);
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, resp) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        resp.send({
            todos
        });
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos/:id', authenticate, (req, resp) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return resp.status(404).send();
        }
        resp.send({
            todo
        });
    }).catch((e) => {
        resp.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, resp) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            resp.status(404).send();
        } else {
            resp.send({
                todo
            });
        }
    }).catch((e) => {
        resp.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, resp) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return resp.status(404).send();
        }

        resp.send({
            todo
        });

    }).catch((e) => resp.status(400).send());

});

app.post('/users', (req, resp) => {

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        resp.header('x-auth', token).send(user);
    }).catch((e) => {
        resp.status(400).send(e);
    });
});

app.post('/users/login', (req, resp) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            resp.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        resp.status(400).send();
    });

});

app.get('/users/me', authenticate, (req, resp) => {
    resp.send(req.user);
})

app.delete('/users/me/token', authenticate, (req, resp) => {
    req.user.removeToken(req.token).then(() => {
        resp.status(200).send();
    }, () => {
        resp.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {
    app
};
