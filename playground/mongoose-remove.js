var {ObjectID} = require('mongodb');
var {mongooose} = require('../server/db/mongoose');
var {Todo} = require('../server/models/todo');
var {User} = require('../server/models/user');

// Todo.remove({}).then((res) => {
//     console.log(res);
// })

// Todo.findByIdAndRemove('5a50a9c6a4889bfdfe098c6b').then((todo) => {
//     console.log(todo);
// })

Todo.findOneAndRemove({text: 'Something to do'}, (err, todo) => {
    if(err) return console.log(err);
    console.log(todo);
})
