// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/todo', (err, db) => {
    if(err) {
        return console.log('Unable to connect mongodb server')
    } 
    console.log('Connected to mongodb server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: true
    // }, (err, result) => {
    //     if(err) return console.log(err);
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    // for(var i=0; i<2; i++) {
    //     db.collection('Users').insertOne({
    //         name: 'naveen',
    //         age: 19,
    //         location: 'Bangalore'
    //     }, (err, result) => {
    //         if(err) return console.log(err);
    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     })
    // }
    db.close();
})