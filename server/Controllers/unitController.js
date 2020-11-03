const unitSaveSchema = require('../models/unitsModel');
const myMongoose = require('mongoose');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myUnitsModel = myMongoose.model('units');

module.exports.redirectToUnitTab = (req, res) => {
    res.render('units')
};

// Save FormData - User to MongoDB
module.exports.saveUnit = (req, res) => {
    console.log('Post a Unit: ' + JSON.stringify(req.body));

    console.log(req.body);

    const newUnit = new unitSaveSchema({
        unitId: req.body.unitId,
        unitName: req.body.unitName,
        unitType: req.body.unitType,
        unitMajorDicipline: req.body.unitMajorDicipline,
        unitActivePassive: req.body.unitActivePassive
    })

    newUnit.save()
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
module.exports.findAllUnits = (req, res) => {
    unitSaveSchema.find().sort({ 'unitId': 1 })
        .then(units => {
            res.send(units);
            console.log("All Units Listed!");
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Find one user
module.exports.findOneUnit = (req, res) => {

    myUnitsModel.findOne(req.query)
        .then(unit => {
            res.send(unit);
            console.log("User found! = " + unit);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkUnitFromDatabase = (req, res) => {

    myUnitsModel.findOne(req.query)
        .then(units => {
            res.send(units);
            console.log("User found! = " + units);
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
            console.log("User deleted! = " + user);
            console.log(req.query);
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
            console.log("Password updated! = " + user);
            console.log(userId, password);
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
            console.log("User data updated! = " + user);
            console.log(myUserId);
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
            console.log("Password updated! = " + user);
            console.log(userId, password);
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