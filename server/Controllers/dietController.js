const polExamAnamnesisSaveSchema = require('../models/polExamAnamnesisModel');
const polExamSaveSchema = require('../models/polExamModel');
const appointmentSaveSchema = require('../models/appointmentModel');
const patientDiagnosisSaveSchema = require('../models/diagnosisModel');
const allDiagnosisSaveSchema = require('../models/allDiagnosisModel');
const inpatientSaveSchema = require('../models/inpatientModel');
const consultationSaveSchema = require('../models/consultationModel');
const labRadSaveSchema = require('../models/patientRadLabModel');
const unitsSaveSchema = require('../models/unitsModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myPolExamAnamnesisModel = myMongoose.model('polyclinicanamneses');
var myPolExamModel = myMongoose.model('polyclinicExam');
var myPatientsModel = myMongoose.model('patients');
var myInpatientsModel = myMongoose.model('inpatients');
var myConsultationsModel = myMongoose.model('consultations');
var myStaffModel = myMongoose.model('staffs');
var myUnitsModel = myMongoose.model('units');
var myAppointmentModel = myMongoose.model('appointments');
var myPatientdiagnosisModel = myMongoose.model('patientdiagnoses');
var allDiagnosisModel = myMongoose.model('diagnosistables');
var labRadTestModel = myMongoose.model('patientradlabtest');
//
module.exports.saveDietAnamneses = (req, res) => {

    const newPolExamAnamnesisSaveSchema = new polExamAnamnesisSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        appointmentStatus: req.body.appointmentStatus,
        patientStory: req.body.patientStory,
        patientAnamnesis: req.body.patientAnamnesis,
        patientExamination: req.body.patientExamination,
        patientHeight: req.body.patientHeight,
        patientWeight: req.body.patientWeight,
        patientWorkoutStyle: req.body.patientWorkoutStyle,
        patientAlmasiGereken: req.body.patientAlmasiGereken,
        patientKutleindexi: req.body.patientKutleindexi,
        patientIdealKilo: req.body.patientIdealKilo,
        patientBmr: req.body.patientBmr,
        patientSavedUser: req.body.patientSavedUser,
        saveDate: req.body.saveDate,
        polyclinicSelect: req.body.polyclinicSelect
    })
    newPolExamAnamnesisSaveSchema.save()
        .then(polExam => {
            res.send(polExam);
            // console.log(polExam)
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.updateDietAnamnesis = (req, res) => {
    myPolExamAnamnesisModel.findOneAndUpdate({ patientProtocolNo: req.body.patientProtocolNo }, {
            $set: {
                patientStory: req.body.patientStory,
                patientAnamnesis: req.body.patientAnamnesis,
                patientExamination: req.body.patientExamination,
                patientWeight: req.body.patientWeight,
                patientHeight: req.body.patientHeight,
                patientWorkoutStyle: req.body.patientWorkoutStyle,
                patientAlmasiGereken: req.body.patientAlmasiGereken,
                patientKutleindexi: req.body.patientKutleindexi,
                patientIdealKilo: req.body.patientIdealKilo,
                patientBmr: req.body.patientBmr
            }
        }, { useFindAndModify: false })
        .then(patientAnamnesisData => {
            res.send(patientAnamnesisData);
            // console.log("Patient data updated! = " + patientAnamnesisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
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

module.exports.findPatientAnamnesisByProtocol = (req, res) => {
    myPolExamAnamnesisModel.find(req.query)
        .then(patientAnamnesisData => {
            res.send(patientAnamnesisData);
            // console.log("patient found! = " + patientAnamnesisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getPatientExamAnamnesisInTooltip = (req, res) => {
    myPolExamAnamnesisModel.find(req.query)
        .then(patientAnamnesisData => {
            res.send(patientAnamnesisData);
            // console.log("getPatientExamAnamnesisInTooltip found! = " + patientAnamnesisData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.hospitalizationProcedure = (req, res) => {
    const newInpatientSaveSchema = new inpatientSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        bedId: req.body.bedId,
        doctorSelect: req.body.doctorSelect,
        hospitalizationDate: req.body.hospitalizationDate,
        exitDate: req.body.exitDate,
        clinicSelect: req.body.clinicSelect,
        patientSavedUser: req.body.patientSavedUser,
        savedDate: req.body.savedDate
    });
    newInpatientSaveSchema.save()
        .then(inpatientData => {
            res.send(inpatientData);
            // console.log('inpatientData = ', inpatientData)
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.fillPatientExamHistoryTable = (req, res) => {
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

module.exports.fillPatientLabRadHistoryTable = (req, res) => {
    labRadTestModel.find(req.query)
        .then(testData => {
            res.send(testData);
            // console.log("testData found! = " + testData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillAppointmentStatusTable = (req, res) => {

    myAppointmentModel.find(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillPatientHealtInsuranceTable = (req, res) => {
    myPolExamModel.aggregate([{
                $match: {
                    patientPolExamDate: (req.query.patientPolExamDate),
                    polyclinicSelect: (req.query.polyclinicSelect),
                    statusSelect: 'Valid'
                }
            },
            {
                $group: {
                    '_id': {
                        insuranceSelect: "$insuranceSelect"
                    },
                    'count': { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
        .then(insuranceData => {
            res.send(insuranceData);
            // console.log('insuranceData = ' + insuranceData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getBeds = (req, res) => {
    myUnitsModel.find(req.query)
        .then(unitData => {
            res.send(unitData);
            // console.log("unit found! = " + unitData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.countFullandEmptyBeds = (req, res) => {

    myInpatientsModel.aggregate([{
                $match: {
                    'clinicSelect': req.query.clinicSelect,
                    'exitDate': ''
                }
            },
            {
                $group: {
                    '_id': "$clinicSelect",
                    'count': { $sum: 1 }
                }
            }
        ])
        .then(bedData => {
            res.send(bedData);
            // console.log("bedData found! = " + bedData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkProtocolInpatients = (req, res) => {
    myInpatientsModel.find(req.query)
        .then(inpatientData => {
            res.send(inpatientData);
            // console.log("inpatientData found! = " + inpatientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.saveConsultation = (req, res) => {
    const newConsultationSaveSchema = new consultationSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        doctorSelect: req.body.doctorSelect,
        consultationDate: req.body.consultationDate,
        acceptDate: req.body.acceptDate,
        clinicSelect: req.body.clinicSelect,
        consultationNote: req.body.consultationNote,
        patientSavedUser: req.body.patientSavedUser,
        savedDate: req.body.savedDate
    });
    newConsultationSaveSchema.save()
        .then(consultationData => {
            res.send(consultationData);
            // console.log('consultationData = ', consultationData)
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.getConsultationCount = (req, res) => {
    myConsultationsModel.aggregate([{
            "$facet": {
                "Total": [
                    { "$match": { "clinicSelect": req.query.unitName } },
                    { "$count": "Total" },
                ],
                "Waiting": [
                    { "$match": { "acceptDate": '', "clinicSelect": req.query.unitName } },
                    { "$count": "Waiting" }
                ],
                "Done": [
                    { "$match": { "acceptDate": { "$nin": [''] }, "clinicSelect": req.query.unitName } },
                    { "$count": "Done" }
                ]
            }
        },
        {
            "$project": {
                "Total": { "$arrayElemAt": ["$Total.Total", 0] },
                "Waiting": { "$arrayElemAt": ["$Waiting.Waiting", 0] },
                "Done": { "$arrayElemAt": ["$Done.Done", 0] }
            }
        }
    ]).then(consultationCountData => {
        res.send(consultationCountData);
        // console.log('consultationCountData = ', consultationCountData)
    }).catch(err => {
        res.status(500).send({
            message: err.message,
            myerr: console.log(err.message)
        });
    });
};

module.exports.fillConsultationHistoryTable = (req, res) => {
    myConsultationsModel.find(req.query)
        .then(consultationData => {
            res.send(consultationData);
            // console.log("consultationData found! = " + consultationData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.savePatientRadLabExaminations = (req, res) => {
    const newLabRadSaveSchema = new labRadSaveSchema({
        patientProtocolNo: req.body.patientProtocolNo,
        patientId: req.body.patientId,
        patientIdNo: req.body.patientIdNo,
        patientNameSurname: req.body.patientNameSurname,
        testCode: req.body.testCode,
        testName: req.body.testName,
        testLab: req.body.testLab,
        testQuantity: req.body.testQuantity,
        testType: req.body.testType,
        saveDate: req.body.saveDate,
        saveUser: req.body.saveUser,
        result: req.body.result,
        resultDate: req.body.resultDate,
        resultUser: req.body.resultUser
    });
    newLabRadSaveSchema.save()
        .then(testData => {
            res.send(testData);
            // console.log('testData = ', testData)
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
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

module.exports.fillPolyclinicPatientCountTable = (req, res) => {
    myPolExamModel.aggregate([{
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

module.exports.fillPatientGenderTable = (req, res) => {
    myPolExamModel.aggregate([{
                $match: {
                    patientPolExamDate: (req.query.patientPolExamDate),
                    polyclinicSelect: (req.query.polyclinicSelect),
                    statusSelect: 'Valid'
                }
            },
            {
                $group: {
                    '_id': {
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
    myPolExamModel.aggregate([{
                $match: {
                    patientPolExamDate: (req.query.patientPolExamDate),
                    polyclinicSelect: (req.query.polyclinicSelect),
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

module.exports.fillAgePercentageTable = (req, res) => {
    myPolExamModel.find(req.query)
        .then(oldPatientData => {
            res.send(oldPatientData);
            // console.log('oldPatientData= ', oldPatientData)
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};