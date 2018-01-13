var env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    process.env.PORT = 3000;
    process.env.DATABASEURL = "mongodb://127.0.0.1:27017/todoApp"
    process.env.JWT_KEY = "nnnaa123677nn"
} else if(env === 'test') {
    process.env.PORT = 3000;
    process.env.DATABASEURL = "mongodb://127.0.0.1:27017/todoAppTest"
    process.env.JWT_KEY = "nnnaa123677nn"   
}