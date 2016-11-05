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

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, resp) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        resp.send(doc);
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos', (req, resp) => {
    Todo.find({}).then((todos) => {
        resp.send({
            todos
        });
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos/:id', (req, resp) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findById(id).then((todo) => {
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

app.delete('/todos/:id', (req, resp) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return resp.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
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

app.patch('/todos/:id', (req, resp) => {
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

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return resp.status(400).send();
        }

        resp.send({
            todo
        });

    }).catch((e) => resp.status(400).send())


});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {
    app
};
