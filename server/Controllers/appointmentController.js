const appointmentSaveSchema = require('../models/appointmentModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');
const { each } = require('async');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myAppointmentModel = myMongoose.model('appointments');
var myPatientsModel = myMongoose.model('patients');

var firstDayOfMonth = myMoment().startOf('month').format('DD-MM-YYYY'),
    lastDayOfMonth = myMoment().endOf('month').format('DD-MM-YYYY'),
    today = today = myMoment().format('DD-MM-YYYY');

module.exports.saveAppointment = (req, res) => {

    const newAppointment = new appointmentSaveSchema({
        appointmentId: req.body.appointmentId,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientName: req.body.patientName,
        patientSurname: req.body.patientSurname,
        patientFatherName: req.body.patientFatherName,
        patientMotherName: req.body.patientMotherName,
        patientGender: req.body.patientGender,
        patientBirthPlace: req.body.patientBirthPlace,
        patientBirthDate: req.body.patientBirthDate,
        patientSavedUser: req.body.patientSavedUser,
        appointmentDate: req.body.appointmentDate,
        appointmentHour: req.body.appointmentHour,
        appointmentPolyclinic: req.body.appointmentPolyclinic,
        appointmentDoctor: req.body.appointmentDoctor,
        appointmentStatus: req.body.appointmentStatus
    })

    newAppointment.save()
        .then(appointment => {
            res.send(appointment);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.getMaxAppointmentId = (req, res) => {
    myAppointmentModel.findOne().sort({ appointmentId: -1 }).limit(1)
        .then(appointment => {
            res.send(appointment);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'getMaxAppointmentId error: ' + err.message
            });
        });
};

module.exports.findPatientAppointmentHistory = (req, res) => {
    myAppointmentModel.find(req.query)
        .then(appointmentData => {
            res.send(appointmentData);
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

module.exports.findByAppointmentId = (req, res) => {
    myAppointmentModel.findOne(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateAppointmentData = (req, res) => {
    myAppointmentModel.findOneAndUpdate(
        { appointmentId: req.body.appointmentId },
        {
            $set: {
                appointmentStatus: req.body.appointmentStatus,
                appointmentHour: req.body.appointmentHour
            }
        },
        { useFindAndModify: false })
        .then(appointment => {
            res.send(appointment);
            // console.log("Patient data updated! = " + patient);
            // console.log(myPatientIdNo);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPolyclinicAppointmentStatusTable = (req, res) => {

    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: { $gte: firstDayOfMonth },
                appointmentDate: { $lte: lastDayOfMonth },
                appointmentStatus: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$appointmentPolyclinic",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(appData => {
            res.send(appData);
            // console.log(appData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillCanceledValidAppointmentTable = (req, res) => {

    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: { $gte: firstDayOfMonth },
                appointmentDate: { $lte: lastDayOfMonth }
            }
        },
        {
            $group: {
                '_id': {
                    appointmentStatus: "$appointmentStatus",
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

module.exports.fillAppointmentGenderTable = (req, res) => {
    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: { $gte: firstDayOfMonth },
                appointmentDate: { $lte: lastDayOfMonth },
                appointmentStatus: 'Valid'
            }
        },
        {
            $group: {
                '_id': {
                    appointmentPolyclinic: '$appointmentPolyclinic',
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

module.exports.fillPolAppointmentStatusTable = (req, res) => {
    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: { $gte: today },
                appointmentStatus: 'Valid'
            }
        },
        {
            $group: {
                "_id": "$appointmentPolyclinic",
                "data": { $push: { appointmentDate: "$appointmentDate", appointmentHour: "$appointmentHour", appointmentId: "$appointmentId", patientName: "$patientName", patientSurname: "$patientSurname" } }
            }
        },
        {
            $sort: { '_id': 1, 'data.appointmentDate': 1 }
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
