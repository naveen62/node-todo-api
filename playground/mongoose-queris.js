var {ObjectID} = require('mongodb');
var {mongooose} = require('../server/db/mongoose');
var {Todo} = require('../server/models/todo');
var {User} = require('../server/models/user');

// changed first char of id from 5 to 6
// let id = '5a4f948c6c017b542743e7b211';
let UserId = '5a4e60a5d47b1d281c2d16a8'
// if(!ObjectID.isValid(id)) {
//     console.log('Id not valid');
// }
// Todo.find({_id: id}).then((todos) => {
//     console.log(todos)
// })

// Todo.findOne({_id: id}).then((todo) => {
//     console.log(todo)
// })
// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         throw "not found id"
//     }
//     console.log(todo)
// }).catch((err) => {
//     console.log(err);
// })
User.findById(UserId).then((user) => {
    if(!user) {
        throw "User id not found"
    }
    console.log(user);
}).catch((err) => console.log(err))