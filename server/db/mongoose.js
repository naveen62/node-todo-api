var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise
mongoose.connect('mongodb://naveen:nyg201yy@ds245687.mlab.com:45687/todo-api')

module.exports = {
    mongoose,
}