const userSaveSchema = require('../models/usersModel');
const userLoginSessionSchema = require('../models/userLoginSessionModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var path = require('path'),
    myUsersModel = myMongoose.model('users'),
    myUserLoginSessionModel = myMongoose.model('userLoginSession'),
    myip = require('quick-local-ip'),
    computerName = require('computer-name');

module.exports.indexControllerGet = function (req, res) {
    // res.sendFile(path.join(__dirname, '../public/htmls', 'index.html'))
    res.render('index');
}

module.exports.findLoginUser = (req, res) => {
    var myUserName = req.query.userName,
        myPassword = req.query.password;

    myUsersModel.findOne({ userName: myUserName, password: myPassword })
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.userLoginSessionSave = (req, res) => {

    // Create a session
    const newSession = new userLoginSessionSchema({
        userId: req.body.userId,
        userName: req.body.userName,
        ipAdress: myip.getLocalIP4(),
        computerName: computerName(),
        sessionStartDate: myMoment(Date.now()).format('DD/MM/YYYY hh:mm:ss'),
        sessionEndDate: ''
    })

    // Save session in the MongoDB
    newSession.save()
        .then(sessionData => {
            res.send(sessionData);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.closeUserLoginSession = (req, res) => {
    var myUserName = req.body.userName;

    myUserLoginSessionModel.findOneAndUpdate(
        { userName: myUserName, sessionEndDate: null },
        {
            $set: {
                "sessionEndDate": myMoment(Date.now()).format('DD/MM/YYYY hh:mm:ss')
            }
        },
        { useFindAndModify: false })
        .then(closedUserSession => {
            res.send(closedUserSession);
            // console.log("User session closed! = " + closedUserSession);
            // console.log(myStaffId);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.userLoginStatistics = (req, res) => {
    myUserLoginSessionModel.find(req.query).sort({ 'sessionStartDate': 1 }).limit(5)
        .then(myData => {
            res.send(myData);
            // console.log(req.query);
            // console.log("All login Listed!", myData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getLastPasswordChangeStatistics = (req, res) => {

    myUsersModel.findOne(req.query)
        .then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkUserPassword = (req, res) => {

    myUsersModel.findOne(req.query)
        .then(user => {
            res.send(user);
            // console.log("User found! = " + user);
            // console.log('checkUserPassword req.query = ', req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.changeUserPassword = (req, res) => {

    var myUserName = req.body.userName,
        myUserOldPassword = req.body.userOldPassword,
        myUserNewPassword = req.body.userNewPassword,
        myIpAdress = myip.getLocalIP4(),
        myComputerName = computerName(),
        myPasswordChangeDate = myMoment(Date.now()).format('DD/MM/YYYY hh:mm:ss');

    myUsersModel.findOneAndUpdate(
        { userName: myUserName },
        {
            $set: {
                'password': myUserNewPassword,
                'userOldPassword': myUserOldPassword,
                'passwordChangeDate': myPasswordChangeDate,
                'passwordChangeMachineName': myComputerName,
                'passwordChangeMachineIp': myIpAdress
            }
        },
        { useFindAndModify: false }
    )
        .then(user => {
            res.send(user);
            // console.log("Password changed! = " + user);
            // console.log(myUserName, myUserNewPassword);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.indexNotFound = function (app) {
    app.use("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
    })
}