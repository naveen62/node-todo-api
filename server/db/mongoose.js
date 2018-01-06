var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASEURL || "mongodb://127.0.0.1:27017/todoApp")

module.exports = {
    mongoose,
}