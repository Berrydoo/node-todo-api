const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('../server');
const {
    Todo
} = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'first todo'
}, {
    _id: new ObjectID(),
    text: 'second todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('Post /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Amazing test text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((resp) => {
                expect(resp.body.text).toBe(text);
            })
            .end((err, resp) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, resp) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        var validId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${validId}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 for non ObjectID', (done) => {

        request(app)
            .get(`/todos/xyz`)
            .expect(404)
            .end(done);

    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo._id).toBe(hexId);
            })
            .end((error, resp) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    return done();
                }).catch((e) => {
                    return done(e);
                });

            });
    });

    it('should return 404 if the todo not found', (done) => {

        var validId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${validId}`)
            .expect(404)
            .end(done);

    });

    it('should return 404 if object id is not valid', (done) => {

        request(app)
            .delete(`/todos/xyz`)
            .expect(404)
            .end(done);

    });
});


describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'updated text',
                completed: true
            })
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe('updated text');
                expect(resp.body.todo.completed).toBe(true);
                expect(resp.body.todo.completedAt).toBeA('number');
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {

        var id = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'new text',
                completed: false
            })
            .expect(200)
            .expect((resp) => {
                expect(resp.body.todo.text).toBe('new text');
                expect(resp.body.todo.completedAt).toNotExist();
                expect(resp.body.todo.completed).toBe(false);
            })
            .end(done);
    });

})
