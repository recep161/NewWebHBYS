const polExamAnamnesisSaveSchema = require('../models/polExamAnamnesisModel');
const polExamSaveSchema = require('../models/polExamModel');
const appointmentSaveSchema = require('../models/appointmentModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myPolExamAnamnesisModel = myMongoose.model('polyclinicanamneses');
var myPolExamModel = myMongoose.model('polyclinicExam');
var myPatientsModel = myMongoose.model('patients');
var myStaffModel = myMongoose.model('staffs');
var myAppointmentModel = myMongoose.model('appointments');

module.exports.savePolExamAnamnesis = (req, res) => {

    const newPolExamAnamnesis = new polExamAnamnesisSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        appointmentStatus: req.body.appointmentStatus,
        patientStory: req.body.patientStory,
        patientAnamnesis: req.body.patientAnamnesis,
        patientExamination: req.body.patientExamination,
        patientDiagnosis: req.body.patientDiagnosis,
        patientSavedUser: req.body.patientSavedUser,
        polyclinicSelect: req.body.polyclinicSelect
    })

    newPolExamAnamnesis.save()
        .then(polExam => {
            res.send(polExam);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.findPatientList = (req, res) => {
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

module.exports.getPatientPersonalIdNo = (req, res) => {
    myPolExamModel.aggregate
        ([
            {
                $match:
                    { patientProtocolNo: +req.query.patientProtocolNo }
            },
            {
                $lookup:
                {
                    from: 'patients',
                    localField: 'patientIdNo',
                    foreignField: 'patientIdNo',
                    as: 'patientData'
                }
            }
        ]).then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getPatientDataToCookie = (req, res) => {
    myPatientsModel.find
        (req.query).then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
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

module.exports.fillPatientAppointmentStatusTable = (req, res) => {
    myAppointmentModel.find(req.query)
        .then(appointmentData => {
            res.send(appointmentData);
            // console.log("appointment found! = " + appointmentData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientUpcomingAppointmentTable = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');
    myAppointmentModel.find(
        {
            patientId: (+req.query.patientId),
            appointmentStatus: 'Valid',
            appointmentDate: { $gte: today }
        })
        .then(appData => {
            res.send(appData);
            // console.log('appData= ' + appData);
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
            // console.log('fillDoctorPatientTable= ', doctorData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillDoctorAppointmentTable = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');
    myAppointmentModel.aggregate([
        {
            $match: {
                appointmentDate: today,
                appointmentStatus: 'Valid'
            }
        },
        {
            $group: {
                '_id': "$appointmentDoctor",
                'count': { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ])
        .then(doctorAppData => {
            res.send(doctorAppData);
            // console.log(doctorAppData)
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