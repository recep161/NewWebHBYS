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

module.exports.announcementsToBottomAndTopScroll = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');

    myAnnouncementModel.find({
        announcementActivePasive: 'Active', announcementEndDate: { $gte: today }
    })
        .then(announcementData => {
            res.send(announcementData);
            // console.log("announcementData found! = " + announcementData);
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

module.exports.fillAnnouncementStatusTable = (req, res) => {
    myAnnouncementModel.aggregate([
        {
            $group: {
                '_id': "$announcementActivePasive",
                'count': { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
        .then(announcement => {
            res.send(announcement);
            // console.log('announcement = '+ announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillAnnouncementUserGroupTable = (req, res) => {
    myAnnouncementModel.aggregate([
        {
            $group: {
                '_id': "$announcementUserGroup",
                'count': { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
        .then(announcement => {
            res.send(announcement);
            // console.log('announcement = '+ announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillAnnouncementMajorDisciplineTable = (req, res) => {
    myAnnouncementModel.aggregate([
        {
            $group: {
                '_id': "$announcementUserMajorDiscipline",
                'count': { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
        .then(announcement => {
            res.send(announcement);
            // console.log('announcement = '+ announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillAnnouncementClinicPolyclinicTable = (req, res) => {
    myAnnouncementModel.aggregate([
        {
            $group: {
                '_id': "$announcementUserClinic",
                'count': { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ])
        .then(announcement => {
            res.send(announcement);
            // console.log('announcement = '+ announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.fillAnnouncementExpirationDateTable = (req, res) => {
    var today = myMoment().format('DD-MM-YYYY');

    myAnnouncementModel.find({ announcementEndDate: { $lte: today } })
        .then(announcement => {
            res.send(announcement);
            // console.log("announcement found! = " + announcement);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};