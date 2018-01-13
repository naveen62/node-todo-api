require('./config/config')

var express = require('express');
var bodyParser = require('body-parser');
const _  = require('lodash')

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {auth} = require('./middleware/authenticate')
var {ObjectID} = require('mongodb');
var bcrypt = require('bcryptjs')



var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send({
        msg: 'Welcome to todo api'
    })
})
app.post('/todos',auth, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400);
        res.send(err)
    })
})

app.get('/todos',auth, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400);
        res.send(err)
    })
})
app.get('/todos/:id',auth, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,    
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400);
        res.send()
    })
})
app.delete('/todos/:id',auth, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404);
        return res.send()
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((err) => {
        res.status(400).send()
    })
})
app.patch('/todos/:id',auth, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo})
    }).catch((err) => {
        res.status(400).send()
    })

})
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var newUser = new User(body);

    newUser.save().then(() => {
        return newUser.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(newUser)
    }).catch((err) => {
        res.status(400).send({
            states: 400,
            msg: err
        })
    })
})

app.get('/users/me',auth, (req, res) => {
    res.send(req.user);
})
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentails(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        }) 
    }).catch((err) => {
        res.status(400).send()
    })
    // User.findOne({email: body.email}).then((user) => {
    //     if(!user) {
    //         return res.status(400).send()
    //     }
    //     bcrypt.compare(body.password, user.password, (err, result) => {
    //         if(result) {
    //             res.send({user})
    //         } else {
    //             res.status(400).send()
    //         }
    //         if(err) return res.status(400).send()
    //     })
    // })
})
app.delete('/users/me/token',auth, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send()
    }, (err) => {
        res.status(400).send()
    })
})
// test does update,delete work on schema var like user = new User use>= user
// ask andrew about 'token[1].access' or something like that
// try Promises with normall functions
// check tostringHex
// {MongoClient}
// check out findOne q&a post

app.listen(port, () => {
    console.log(`started up at ${port}`);
})


module.exports = {
    app,
}


// x-auth →eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTU4OTU5OWQxY2QyNjkwMjA0YWViMjMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE1NzU0OTA2fQ.NgOuworY2X2OhsVFPctlI5PckJjZfuimQwkEhLZUgTo


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTU4OTU5OWQxY2QyNjkwMjA0YWViMjMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE1NzU0OTgyfQ.p2Ep5tcuKf4fuXOoCvf7gZ3Uz16-PlRRkznVAsdD1SM