var myMongoose = require('mongoose'),
    myMongoDb = 'mongodb://localhost:27017/WebHBYS';

myMongoose.Promise = require('bluebird');
myMongoose.set('useCreateIndex', true);

myMongoose.connect(myMongoDb, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) {
        console.log('Couldnt connected...: ' + err.error)
    } else {
        console.log('Connected to...: ' + myMongoDb)
    }
})