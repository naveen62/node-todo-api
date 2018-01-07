require('./config/config')

var express = require('express');
var bodyParser = require('body-parser');
const _  = require('lodash')

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');



var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400);
        res.send(err)
    })
})

app.get('/todos', (req, res) => {
    Todo.find({}).then((todos) => {
        res.send({todos})
    }, (err) => {
        res.status(400);
        res.send(err)
    })
})
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400);
        res.send()
    })
})
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        res.status(404);
        return res.send()
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch((err) => {
        res.status(400).send()
    })
})
app.patch('/todos/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo})
    }).catch((err) => {
        res.status(400).send()
    })

})
// check tostringHex
// {MongoClient}

app.listen(port, () => {
    console.log(`started up at ${port}`);
})

module.exports = {
    app,
}