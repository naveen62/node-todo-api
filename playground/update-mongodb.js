var {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if (err) return console.log(err);

    console.log('Connected to mongo server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a49c89eb961927ee9fce4d2')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // }).catch((err) => {
    //     console.log(err);
    // })
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a493404c07320bdc2736f49')
    },{
        $set: {
            name: 'naveen'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result) 
    })
})