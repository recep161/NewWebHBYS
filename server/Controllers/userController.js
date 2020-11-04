const userSaveSchema = require('../models/usersModel');
const myMongoose = require('mongoose');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myUsersModel = myMongoose.model('users');

module.exports.redirectToUserTab = (req, res) => {
    res.render('users')
    // console.log('redirectToUserTab')
};

// Save FormData - User to MongoDB
module.exports.saveUser = (req, res) => {
    console.log('Post a User: ' + JSON.stringify(req.body));

    // Create a Customer
    console.log(req.body);

    const newUser = new userSaveSchema({
        userId: req.body.userId,
        userName: req.body.userNickname,
        password: req.body.userPassword,
        name: req.body.userName,
        surname: req.body.userSurname,
        personalIdNumber: req.body.userTc,
        majorDicipline: req.body.userMajorDicipline,
        userGroup: req.body.userGroup,
        userPhotoSrc: req.body.userPhotoSrc
    })

    // Save a Customer in the MongoDB
    newUser.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

// Fetch all Users
module.exports.findAllUsers = (req, res) => {
    userSaveSchema.find().sort({ 'userId': 1 })
        .then(users => {
            res.send(users);
            // console.log("All Users Listed!");
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Find one user
module.exports.findOneUser = (req, res) => {

    myUsersModel.findOne(req.query)
        .then(users => {
            res.send(users);
            // console.log("User found! = " + users);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkUserFromDatabase = (req, res) => {

    myUsersModel.findOne(req.query)
        .then(users => {
            res.send(users);
            // console.log("User found! = " + users);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Delete user
module.exports.deleteUser = (req, res) => {

    myUsersModel.deleteOne(req.query)
        .then(user => {
            res.send(user);
            // console.log("User deleted! = " + user);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.resetPassword = (req, res) => {
    var myUserId = req.body.userId,
        myPassword = req.body.userPassword;

    myUsersModel.findOneAndUpdate({ userId: myUserId }, { $set: { "password": myPassword } })
        .then(user => {
            res.send(user);
            // console.log("Password updated! = " + user);
            // console.log(userId, password);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateUserData = (req, res) => {
    var myUserId = req.body.userId,
        myUserName = req.body.userNickname,
        myName = req.body.userName,
        myUserSurname = req.body.userSurname,
        myUserPersonalIdNumber = req.body.userTc,
        myUserMajorDicipline = req.body.userMajorDicipline,
        myUserGroup = req.body.userGroup;

    myUsersModel.findOneAndUpdate(
        { userId: myUserId },
        {
            $set: {
                "userId": myUserId,
                "userName": myUserName,
                "name": myName,
                "surname": myUserSurname,
                "personalIdNumber": myUserPersonalIdNumber,
                "majorDicipline": myUserMajorDicipline,
                "userGroup": myUserGroup
            }
        })
        .then(user => {
            res.send(user);
            // console.log("User data updated! = " + user);
            // console.log(myUserId);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updatePhoto = (req, res) => {
    var myUserId = req.body.userId,
        myUserPhoto = req.body.userPhoto;

    myUsersModel.findOneAndUpdate({ userId: myUserId }, { $set: { "userPhotoSrc": myUserPhoto } })
        .then(user => {
            res.send(user);
            // console.log("Password updated! = " + user);
            // console.log(userId, password);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getMaxUserId = (req, res) => {
    myUsersModel.findOne().sort({ userId: -1 }).limit(1)
        .then(user => {
            res.send(user);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'maxUserId error: ' + err.message
            });
        });
};

module.exports.fillUserStatisticsTable = (req, res) => {
    myUsersModel.aggregate([
        {
            $group: {
                '_id': "$userGroup",
                'count': { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
        .then(docs => {
            res.send(docs);
            // console.log(docs);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};