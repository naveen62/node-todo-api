var mongoose = require('mongoose'); 

mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${process.env.DATABASEURL}` || "mongodb://127.0.0.1:27017/todoApp", {useMongoClient: true})

module.exports = {
    mongoose,
}