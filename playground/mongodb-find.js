const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todo', (err, db) => {
    if(err) {
        return console.log(err);
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').find({_id: new ObjectID('5a49093584475c1c547ef268')}).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }).catch((err) => {
    //     console.log(err)
    // })
    // db.collection('Todos').find().count().then((counts) => {
    //     console.log(`Todo counts: ${counts}`);
        
    // }).catch((err) => {
    //     console.log(err)
    // })
    db.collection('Users').find({name: 'naveen'}).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2))
    }).catch((err) => {
        console.log(err);
    })
    db.collection('Users').find({name: 'naveen'}).count((err, counts) => {
        if(err) return console.log(err);
        console.log(`User conts: ${counts}`);
    })

    // db.close();
})