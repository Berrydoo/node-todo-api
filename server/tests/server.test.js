const expect = require('expect');
const request = require('supertest');

const {
    app
} = require('../server');
const {
    Todo
} = require('../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done());
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

                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });

});