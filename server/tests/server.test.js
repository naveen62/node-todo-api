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
const {
    User
} = require('../models/user')
const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed')

// beforeEach runs before every test case
beforeEach(populateTodos)
beforeEach(populateUsers)

describe('/POST todos', () => {
    it('should create new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({
                    text: text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
    })
    it('Should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .expect((res) => {
                expect(res.body).toInclude({
                    message: 'Todo validation failed'
                })
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({}).then((todos) => {
                    expect(todos.length).toBe(2);
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
})
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    })
    it('should not return todo doc created by other users', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID()
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(undefined).toBe()
            })
            .end(done)
    })
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(undefined).toBe()
            })
            .end(done)
    })
})
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist()
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
    it('should not remove a todo of others', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist()
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
    it('Should return 404 if todo not found', (done) => {
        var id = new ObjectID()
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(undefined).toBe()
            })
            .end(done)
    })
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .set('x-auth', users[1].tokens[0].token)
            .expect((res) => {
                expect(undefined).toBe()
            })
            .end(done)
    })
})
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var idHex = todos[0]._id.toHexString();

        var text = 'changed from test'
        var completed = true

        request(app)
            .patch(`/todos/${idHex}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text,
                completed
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toInclude({
                    text,
                    completed
                });
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)

    })
    it('should not update the todo of other users', (done) => {
        var idHex = todos[0]._id.toHexString();

        var text = 'changed from test'
        var completed = true

        request(app)
            .patch(`/todos/${idHex}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text,
                completed
            })
            .expect(404)
            .end(done)

    })
    it('should clear completedAt when todo is not completed', (done) => {
        var idHex = todos[1]._id.toHexString();
        var send = {
            text: 'changed from test2',
            completed: false
        }
        request(app)
            .patch(`/todos/${idHex}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(send)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toInclude(send)
                expect(res.body.todo.completedAt).toNotExist()
            })
            .end(done);
    })
})
describe('GET /users/me', () => {
    it('should return user if authenticatioed', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'bcdsjh')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})
describe('POST /users', () => {
    it('should create a user', (done) => {
        var user = {
            email: 'example@gmail.com',
            password: 'pass123'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
                expect(res.body._id).toExist()
                expect(res.body.email).toBe(user.email)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findOne({
                    email: user.email
                }).then((doc) => {
                    expect(doc.email).toBe(user.email)
                    expect(doc.password).toNotBe(user.password)
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
    it('should return validation errors if request invalid', (done) => {
        var user = {
            email: 'inValidEmail',
            password: '123'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .expect((res) => {
                expect(res.body).toNotInclude(user)
            })
            .end(done)
    })
    it('should not create user if email in use', (done) => {
        var user = {
            email: 'naveen@gmail.com',
            password: '123abcd'
        }
        request(app)
            .post('/users')
            .send(user)
            .expect(400)
            .expect((res) => {
                expect(res.body).toNotInclude(user)
            })
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.find({
                    email: 'naveen@gmail.com'
                }).then((doc) => {
                    expect(doc.length).toBe(1)
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })


})
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist()
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    })
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'nnnn'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist()
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done()
                }).catch((err) => {
                    done(err)
                })
            })
    })
})
describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((err) => {
                    done(err)
                })

            })
    })
})