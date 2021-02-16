const announcementSaveSchema = require('../models/announcementModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myAnnouncementModel = myMongoose.model('announcements');

module.exports.saveAnnouncement = (req, res) => {
    const newAnnouncement = new announcementSaveSchema({
        announcementId: req.body.announcementId,
        announcementTitle: req.body.announcementTitle,
        announcementUserGroup: req.body.announcementUserGroup,
        announcementUserMajorDiscipline: req.body.announcementUserMajorDiscipline,
        announcementUserClinic: req.body.announcementUserClinic,
        announcementStartDate: req.body.announcementStartDate,
        announcementEndDate: req.body.announcementEndDate,
        announcementShowTime: req.body.announcementShowTime,
        announcementActivePasive: req.body.announcementActivePasive,
        announcementText: req.body.announcementText,
        announcementSavedUser: req.body.announcementSavedUser
    })

    newAnnouncement.save()
        .then(announcement => {
            res.send(announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message,
                myerr: console.log(err.message)
            });
        });
};

module.exports.getMaxAnnouncementId = (req, res) => {
    myAnnouncementModel.findOne().sort({ announcementId: -1 }).limit(1)
        .then(announcement => {
            res.send(announcement);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'getMaxProtocolNo error: ' + err.message
            });
        });
};

module.exports.findAnnouncementHistory = (req, res) => {
    myAnnouncementModel.find(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.findByAnnouncementId = (req, res) => {
    myAnnouncementModel.findOne(req.query)
        .then(patientData => {
            res.send(patientData);
            // console.log("patient found! = " + patientData);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateAnnouncementData = (req, res) => {
    myAnnouncementModel.findOneAndUpdate(
        { announcementId: req.body.announcementId },
        {
            $set: {
                announcementTitle: req.body.announcementTitle,
                announcementUserGroup: req.body.announcementUserGroup,
                announcementUserMajorDiscipline: req.body.announcementUserMajorDiscipline,
                announcementUserClinic: req.body.announcementUserClinic,
                announcementStartDate: req.body.announcementStartDate,
                announcementEndDate: req.body.announcementEndDate,
                announcementShowTime: req.body.announcementShowTime,
                announcementActivePasive: req.body.announcementActivePasive,
                announcementText: req.body.announcementText
            }
        },
        { useFindAndModify: false })
        .then(announcement => {
            res.send(announcement);
            // console.log("Patient data updated! = " + patient);
            // console.log(myPatientIdNo);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// module.exports.fillPatientAppointmentStatusTable = (req, res) => {
//     myAppointmentModel.find(req.query)
//         .then(appointmentData => {
//             res.send(appointmentData);
//             // console.log("appointment found! = " + appointmentData);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillPatientUpcomingAppointmentTable = (req, res) => {
//     var today = myMoment().format('DD-MM-YYYY');
//     myAppointmentModel.find(
//         {
//             patientId: (+req.query.patientId),
//             appointmentStatus: 'Valid',
//             appointmentDate: { $gte: today }
//         })
//         .then(appData => {
//             res.send(appData);
//             // console.log('appData= ' + appData);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillPatientVisitStatisticsTable = (req, res) => {
//     myPolExamModel.aggregate([
//         {
//             $match: {
//                 patientId: (+req.query.patientId),
//                 statusSelect: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': "$polyclinicSelect",
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(polData => {
//             res.send(polData);
//             // console.log('polData= ' + polData);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillPolyclinicPatientCountTable = (req, res) => {
//     myPolExamModel.aggregate([
//         {
//             $match: {
//                 patientPolExamDate: (req.query.patientPolExamDate),
//                 statusSelect: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': "$polyclinicSelect",
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(polData => {
//             res.send(polData);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillPatientHealtInsuranceTable = (req, res) => {
//     myPolExamModel.aggregate([
//         {
//             $match: {
//                 patientPolExamDate: (req.query.patientPolExamDate),
//                 statusSelect: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': {
//                     polyclinicSelect: "$polyclinicSelect",
//                     insuranceSelect: "$insuranceSelect"
//                 },
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(polData => {
//             res.send(polData);
//             // console.log(polData)
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillPatientGenderTable = (req, res) => {
//     myPolExamModel.aggregate([
//         {
//             $match: {
//                 patientPolExamDate: (req.query.patientPolExamDate),
//                 statusSelect: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': {
//                     polyclinicSelect: "$polyclinicSelect",
//                     patientGender: "$patientGender"
//                 },
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(polData => {
//             res.send(polData);
//             // console.log(polData)
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillDoctorPatientTable = (req, res) => {
//     myPolExamModel.aggregate([
//         {
//             $match: {
//                 patientPolExamDate: (req.query.patientPolExamDate),
//                 statusSelect: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': {
//                     doctorSelector: "$doctorSelector",
//                     polyclinicSelect: "$polyclinicSelect"
//                 },
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(doctorData => {
//             res.send(doctorData);
//             // console.log('fillDoctorPatientTable= ', doctorData)
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillDoctorAppointmentTable = (req, res) => {
//     var today = myMoment().format('DD-MM-YYYY');
//     myAppointmentModel.aggregate([
//         {
//             $match: {
//                 appointmentDate: today,
//                 appointmentStatus: 'Valid'
//             }
//         },
//         {
//             $group: {
//                 '_id': "$appointmentDoctor",
//                 'count': { $sum: 1 }
//             }
//         },
//         {
//             $sort: { _id: 1 }
//         }
//     ])
//         .then(doctorAppData => {
//             res.send(doctorAppData);
//             // console.log(doctorAppData)
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };

// module.exports.fillDoctorOnLeaveTable = (req, res) => {
//     var today = myMoment().toDate();

//     myStaffModel.aggregate(
//         [
//             {
//                 $match: {
//                     'staffLeaveEndDate': { $gte: today },
//                     staffGroup: 'Doctor'
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ]
//     )
//         .then(doctorOnLeave => {
//             res.send(doctorOnLeave);
//             // console.log('doctorOnLeave = ', doctorOnLeave);
//         }).catch(err => {
//             res.status(500).send({
//                 message: err.message
//             });
//         });
// };