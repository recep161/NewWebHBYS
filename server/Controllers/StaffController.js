const staffSaveSchema = require('../models/staffModel');
const myMongoose = require('mongoose');
const myMoment = require('moment');

var myDb = require('../models/dbConnection');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myStaffModel = myMongoose.model('staffs');

// redirect to staff
module.exports.redirectToStaffTab = (req, res) => {
    res.render('staff')
    // console.log('redirectToStaffTab')
};

// Save FormData - staff to MongoDB
module.exports.saveStaff = (req, res) => {
    // console.log('Post a staff: ' + JSON.stringify(req.body));

    var myStaffLeaveEndDate,
        myStaffLeaveStartDate;

    if (req.body.staffLeaveStartDate == '') {
        myStaffLeaveStartDate == '-----------';
        myStaffLeaveEndDate == '-----------';
    } else {
        myStaffLeaveEndDate = myMoment(req.body.staffLeaveEndDate, "DD-MM-YYYY").add(1, 'days').startOf('day');
        myStaffLeaveStartDate = myMoment(req.body.staffLeaveStartDate, "DD-MM-YYYY").add(1, 'days').startOf('day');
    }

    // console.log('recx = ', myStaffLeaveStartDate)
    // Create a staff
    // console.log(req.body);

    const newStaff = new staffSaveSchema({
        staffId: req.body.staffId,
        staffIdNumber: req.body.staffTc,
        staffName: req.body.staffName,
        staffSurname: req.body.staffSurname,
        staffDiplomaNo: req.body.staffDiplomaNo,
        majorDicipline: req.body.staffMajorDicipline,
        staffGroup: req.body.staffGroup,
        staffPhotoSrc: req.body.staffPhotoSrc,
        staffLeaveStartDate: myStaffLeaveStartDate,
        staffLeaveEndDate: myStaffLeaveEndDate
    })

    // Save a staff in the MongoDB
    newStaff.save()
        .then(data => {
            res.send(data);
            // console.log(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message
                // , myerr: console.log(err.message)
            });
        });
};

// Fetch all staffs
module.exports.findAllStaff = (req, res) => {
    staffSaveSchema.find().sort({ 'staffId': 1 })
        .then(users => {
            res.send(users);
            // console.log("All Staff Listed!");
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Find one staff
module.exports.findOneStaff = (req, res) => {

    myStaffModel.findOne(req.query)
        .then(staff => {
            res.send(staff);
            // console.log("Staff found! = " + staff);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkStaffFromDatabase = (req, res) => {

    myStaffModel.findOne(req.query)
        .then(staff => {
            res.send(staff);
            // console.log("Staff found! = " + staff);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Delete staff
module.exports.deleteStaff = (req, res) => {
    myStaffModel.deleteOne(req.query)
        .then(staff => {
            res.send(staff);
            // console.log("Staff deleted! = " + staff);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updatePhoto = (req, res) => {
    var myStaffId = req.body.staffId,
        myStaffPhoto = req.body.staffPhoto;

    myStaffModel.findOneAndUpdate({ staffId: myStaffId }, { $set: { "staffPhotoSrc": myStaffPhoto } })
        .then(staff => {
            res.send(staff);
            // console.log("Photo updated! = " + staff);
            // console.log(myStaffId, myStaffPhoto);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateStaffData = (req, res) => {
    var myStaffLeaveEndDate,
        myStaffLeaveStartDate;

    if (req.body.staffLeaveStartDate == '') {
        myStaffLeaveStartDate == '-----------';
        myStaffLeaveEndDate == '-----------';
    } else {
        myStaffLeaveEndDate = myMoment(req.body.staffLeaveEndDate, "DD-MM-YYYY").add(1, 'days').startOf('day');
        myStaffLeaveStartDate = myMoment(req.body.staffLeaveStartDate, "DD-MM-YYYY").add(1, 'days').startOf('day');
    }

    var myStaffId = req.body.staffId,
        myStaffTc = req.body.staffTc,
        myStaffName = req.body.staffName,
        myStaffSurname = req.body.staffSurname,
        myStaffDiplomaNo = req.body.staffDiplomaNo,
        myStaffLeaveStartDate = myStaffLeaveStartDate,
        myStaffLeaveEndDate = myStaffLeaveEndDate,
        myStaffMajorDicipline = req.body.staffMajorDicipline,
        myStaffGroup = req.body.staffGroup;

    myStaffModel.findOneAndUpdate(
        { staffId: myStaffId },
        {
            $set: {
                "staffIdNumber": myStaffTc,
                "staffName": myStaffName,
                "staffSurname": myStaffSurname,
                "staffDiplomaNo": myStaffDiplomaNo,
                "staffLeaveStartDate": myStaffLeaveStartDate,
                "staffLeaveEndDate": myStaffLeaveEndDate,
                "majorDicipline": myStaffMajorDicipline,
                "staffGroup": myStaffGroup
            }
        })
        .then(staff => {
            res.send(staff);
            // console.log("User data updated! = " + staff);
            // console.log(myStaffId);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

module.exports.getMaxStaffId = (req, res) => {
    myStaffModel.findOne().sort({ staffId: -1 }).limit(1)
        .then(staff => {
            res.send(staff);
        }).catch(err => {
            res.status(500).send({
                message: 'getMaxStaffId error: ' + err.message
            });
        });
};

module.exports.fillStaffStatisticsTable = (req, res) => {
    myStaffModel.aggregate([
        {
            $group: {
                '_id': "$staffGroup",
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

module.exports.countTableAndRows = (req, res) => {
    myMongoose.connection.db.listCollections().toArray(function (err, names) {
        res.send(names)
    });

    // myStaffModel.collection.stats(function (err, results) {
    //     res.send(results);
    // });
};

module.exports.fillStafOnLeaveTable = (req, res) => {
    var today = myMoment().toDate();

    myStaffModel.aggregate(
        [
            {
                $match: { 'staffLeaveEndDate': { $gte: today } }
            },
            {
                $group: {
                    '_id': "$staffGroup",
                    'count': { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]
    )
        .then(staffOnLeave => {
            res.send(staffOnLeave);
            // console.log('staffOnLeave = ', staffOnLeave);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}