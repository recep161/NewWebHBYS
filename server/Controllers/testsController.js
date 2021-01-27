const testSaveSchema = require('../models/testsModel');
const myMongoose = require('mongoose');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myUnitsModel = myMongoose.model('tests');

module.exports.redirectToTestTab = (req, res) => {
    res.render('tests')
};

// Save FormData - User to MongoDB
module.exports.saveUnit = (req, res) => {
    const newUnit = new unitSaveSchema({
        unitId: req.body.unitId,
        unitName: req.body.unitName,
        unitType: req.body.unitType,
        unitMajorDicipline: req.body.unitMajorDicipline,
        beds: req.body.beds,
        unitActivePassive: req.body.unitActivePassive
    })

    newUnit.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
                // , myerr: console.log(err.message)
            });
        });
};

// Fetch all Units
module.exports.findAllUnits = (req, res) => {
    unitSaveSchema.find().sort({ 'unitId': 1 })
        .then(units => {
            res.send(units);
            // console.log("All Units Listed!");
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Find one unit
module.exports.findOneUnit = (req, res) => {

    myUnitsModel.findOne(req.query)
        .then(unit => {
            res.send(unit);
            // console.log("Unit found! = " + unit);
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
            // console.log("User found! = " + units);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateUnitData = (req, res) => {
    var myUnitId = req.body.unitId,
        myUnitName = req.body.unitName,
        myUnitType = req.body.unitType,
        myUnitMajorDicipline = req.body.unitMajorDicipline,
        myBeds = req.body.beds,
        myUnitActivePassive = req.body.unitActivePassive;

    myUnitsModel.findOneAndUpdate(
        { unitId: myUnitId },
        {
            $set: {
                "unitName": myUnitName,
                "unitType": myUnitType,
                "unitMajorDicipline": myUnitMajorDicipline,
                "beds": myBeds,
                "unitActivePassive": myUnitActivePassive
            }
        })
        .then(unit => {
            res.send(unit);
            // console.log("Unit data updated! = " + unit);
            // console.log(myUnitName);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.getMaxUnitId = (req, res) => {
    myUnitsModel.findOne().sort({ unitId: -1 }).limit(1)
        .then(unit => {
            res.send(unit);
            // console.log("max id = " + user.userId);
        }).catch(err => {
            res.status(500).send({
                message: 'MaxUnitId error: ' + err.message
            });
        });
};

module.exports.fillUnitStatisticsTable = (req, res) => {
    myUnitsModel.aggregate([
        {
            $group: {
                '_id': { unitType: "$unitType", unitActivePassive: "$unitActivePassive" },
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

module.exports.fetchUnits = (req, res) => {
    myUnitsModel.find(req.query).sort({ 'unitName': 1 })
        .then(units => {
            res.send(units);
            // console.log("All Units Listed: " + units);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};