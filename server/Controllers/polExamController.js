const polExamSaveSchema = require('../models/polExamModel');
const staffSaveSchema = require('../models/staffModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myPolExamModel = myMongoose.model('polyclinicExam');
var myPatientsModel = myMongoose.model('patients');
var myStaffModel = myMongoose.model('staffs');

module.exports.savePolExam = (req, res) => {

    const newPolExam = new polExamSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        patientFatherName: req.body.patientFatherName,
        patientMotherName: req.body.patientMotherName,
        patientGender: req.body.patientGender,
        patientBirthPlace: req.body.patientBirthPlace,
        patientBirthDate: req.body.patientBirthDate,
        patientSavedUser: req.body.patientSavedUser,
        patientPolExamDate: req.body.patientPolExamDate,
        insuranceSelect: req.body.insuranceSelect,
        polyclinicSelect: req.body.polyclinicSelect,
        doctorSelector: req.body.doctorSelector,
        statusSelect: req.body.statusSelect
    })

    newPolExam.save()
        .then(polExam => {
            res.send(polExam);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.getMaxProtocolNo = (req, res) => {
    myPolExamModel.findOne().sort({ patientProtocolNo: -1 }).limit(1)
        .then(patient => {
            res.send(patient);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'getMaxProtocolNo error: ' + err.message
            });
        });
};

module.exports.findPatientHistory = (req, res) => {
    myPolExamModel.find(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.findPatient = (req, res) => {

    myPatientsModel.findOne(req.query)
        .then(patient => {
            res.send(patient);
            // console.log("patient found! = " + patient);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.findByProtocol = (req, res) => {
    myPolExamModel.findOne(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updatePolExam = (req, res) => {
    myPolExamModel.findOneAndUpdate(
        { patientProtocolNo: req.body.patientProtocolNo },
        {
            $set: {
                insuranceSelect: req.body.insuranceSelect,
                doctorSelector: req.body.doctorSelector,
                statusSelect: req.body.statusSelect
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

module.exports.fillPatientVisitStatisticsTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientId: (+req.query.patientId),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$polyclinicSelect",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log('polData= ' + polData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPolyclinicPatientCountTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$polyclinicSelect",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientHealtInsuranceTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    polyclinicSelect: "$polyclinicSelect",
                    insuranceSelect: "$insuranceSelect"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log(polData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientGenderTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    polyclinicSelect: "$polyclinicSelect",
                    patientGender: "$patientGender"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(polData => {
            res.send(polData);
            // console.log(polData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorPatientTable = (req, res) => {
    myPolExamModel.aggregate([
        {
            $match: {
                patientPolExamDate: (req.query.patientPolExamDate),
                statusSelect: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    doctorSelector: "$doctorSelector",
                    polyclinicSelect: "$polyclinicSelect"
                },
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(doctorData => {
            res.send(doctorData);
            // console.log(doctorData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorOnLeaveTable = (req, res) => {
    var today = myMoment().toDate();

    myStaffModel.aggregate(
        [
            {
                $match: {
                    'staffLeaveEndDate': { $gte: today },
                    staffGroup: 'Doctor'
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]
    )
        .then(doctorOnLeave => {
            res.send(doctorOnLeave);
            // console.log('doctorOnLeave = ', doctorOnLeave);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};