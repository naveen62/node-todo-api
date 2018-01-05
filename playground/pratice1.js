var {Test} = require('./pratice');

var newTest = new Test({
    text: 'c'
})

Test.findOne({_id: '5a4f6b4881f9d6282be340ed'}).then((res) => {
    console.log(res)
}).catch((err) => {
    console.log(err)
})