const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc1231'

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash)
//     })
// })
var hashedPassword = '$2a$10$T8/xpSqlD1Ugum7o0cuKD.ckzfy.hbsf8O0OjqXwFft3ilaQFPfcW';

bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(err)
    console.log(res)
})

// using jsonwebtoken(jwt) method
// var data = {
//     id: 10
// }
// var token = jwt.sign(data, '123sec')
// console.log(token);

// var decode = jwt.verify(token, '123sec');
// console.log(decode);



//  using crypto-js 
// var msg = 'i am user 1'
// var hash = SHA256(msg).toString();
// console.log(`msg: ${msg}\nhash: ${hash}`);

// var data = {
//     id: 4
// }
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('data was changed');
// }