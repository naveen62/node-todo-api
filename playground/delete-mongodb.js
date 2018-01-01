var {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if(err) return console.log(err);

    console.log('Connected to mongodb server');
    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result.result);
    // }, (err) => {
    //     console.log(err);
    // })
    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // })
    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}, (err, result) => {
    //     if(err) return console.log(err);
    //     console.log(JSON.stringify(result, undefined, 2));
    // })
    // chalenge
    // db.collection('Users').deleteMany({name: 'naveen'}).then((result) => {
    //     console.log(result.result);
    // }).catch((err) => {
    //     console.log(err);
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5a493434c07320bdc2736f51")}, (err, result) => {
        if(err) return console.log(err);
        console.log(result)
    })

})  