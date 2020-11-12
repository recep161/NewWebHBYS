const polExamSaveSchema = require('../models/polExamModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myPolExamModel = myMongoose.model('polyclinicExam');

// Save FormData - User to MongoDB
module.exports.savePatient = (req, res) => {
    var myPatientBirthDate;

    if (req.body.patientBirthDate == '') {
        myPatientBirthDate == '-----------';
    } else {
        myPatientBirthDate = myMoment(req.body.patientBirthDate, "DD-MM-YYYY").startOf('day');
    }

    // Create a Customer

    const newUser = new patientSaveSchema({
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientName: req.body.patientName,
        patientSurname: req.body.patientSurname,
        patientFatherName: req.body.patientFatherName,
        patientMotherName: req.body.patientMotherName,
        patientGender: req.body.patientGender,
        patientBirthPlace: req.body.patientBirthPlace,
        patientBirthDate: myPatientBirthDate,
        patientPhone: req.body.patientPhone,
        patientAdress: req.body.patientAdress,
        patientPhotoSrc: req.body.patientPhotoSrc,
        patientSavedUser: req.body.patientSavedUser
    })

    // Save a Customer in the MongoDB
    newUser.save()
        .then(patient => {
            res.send(patient);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.getMaxPatientId = (req, res) => {
    myPatientsModel.findOne().sort({ patientId: -1 }).limit(1)
        .then(patient => {
            res.send(patient);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'getMaxPatientId error: ' + err.message
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
module.exports.findOnePatient = (req, res) => {

    myPatientsModel.findOne(req.query)
        .then(patient => {
            res.send(patient);
            // console.log("User found! = " + users);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updatePatientData = (req, res) => {
    var myPatientId = req.body.patientId,
        myPatientIdNo = req.body.patientIdNo,
        myPatientName = req.body.patientName,
        myPatientSurname = req.body.patientSurname,
        myPatientFatherName = req.body.patientFatherName,
        myPatientMotherName = req.body.patientMotherName,
        myPatientGender = req.body.patientGender,
        myPatientBirthPlace = req.body.patientBirthPlace,
        myPatientBirthDate = req.body.patientBirthDate,
        myPatientPhone = req.body.patientPhone,
        myPatientAdress = req.body.patientAdress,
        myPatientPhotoSrc = req.body.patientPhotoSrc;

    if (myPatientBirthDate == '') {
        myPatientBirthDate = myMoment(req.body.patientBirthDate, "DD-MM-YYYY").startOf('day');
    }

    myPatientsModel.findOneAndUpdate(
        { patientId: myPatientId },
        {
            $set: {
                patientIdNo: myPatientIdNo,
                patientName: myPatientName,
                patientSurname: myPatientSurname,
                patientFatherName: myPatientFatherName,
                patientMotherName: myPatientMotherName,
                patientGender: myPatientGender,
                patientBirthPlace: myPatientBirthPlace,
                patientBirthDate: myPatientBirthDate,
                patientPhone: myPatientPhone,
                patientAdress: myPatientAdress,
                patientPhotoSrc: myPatientPhotoSrc
            }
        },
        { useFindAndModify: false })
        .then(patient => {
            res.send(patient);
            // console.log("Patient data updated! = " + patient);
            // console.log(myPatientIdNo);
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