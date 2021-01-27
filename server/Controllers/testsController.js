const testSaveSchema = require('../models/testsModel');
const myMongoose = require('mongoose');

myMongoose.connect('mongodb://localhost:27017/WebHBYS', { useFindAndModify: false });

var myTestsModel = myMongoose.model('tests');

module.exports.redirectToTestTab = (req, res) => {
    res.render('tests')
};

// Save FormData - User to MongoDB
module.exports.saveTest = (req, res) => {
    const newTest = new testSaveSchema({
        testId: req.body.testId,
        testCode: req.body.testCode,
        testName: req.body.testName,
        testType: req.body.testType,
        testLab: req.body.testLab,
        testHint: req.body.testHint,
        maxRequest: req.body.maxRequest,
        testActivePassive: req.body.testActivePassive
    })

    newTest.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message
                , myerr: console.log(err.message)
            });
        });
};

// Fetch all Units
module.exports.findAllTests = (req, res) => {
    testSaveSchema.find().sort({ 'testCode': 1 })
        .then(tests => {
            res.send(tests);
            // console.log("All tests Listed!");
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

// Find one unit
module.exports.findOneTest = (req, res) => {

    myTestsModel.findOne(req.query)
        .then(test => {
            res.send(test);
            // console.log("Unit found! = " + test);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.checkTestFromDatabase = (req, res) => {

    myTestsModel.findOne(req.query)
        .then(tests => {
            res.send(tests);
            // console.log("test found! = " + tests);
            // console.log(req.query);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

module.exports.updateTestData = (req, res) => {
    var myTestId = req.body.testId,
        myTestCode = req.body.testCode,
        myTestName = req.body.testName,
        myTestType = req.body.testType,
        myTestLab = req.body.testLab,
        myTestHint = req.body.testHint,
        myMaxRequest = req.body.maxRequest,
        myTestActivePassive = req.body.testActivePassive;

    myTestsModel.findOneAndUpdate(
        { testId: myTestId },
        {
            $set: {
                "testCode": myTestCode,
                "testName": myTestName,
                "testType": myTestType,
                "testLab": myTestLab,
                "testHint": myTestHint,
                "maxRequest": myMaxRequest,
                "testActivePassive": myTestActivePassive
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

module.exports.getMaxTestId = (req, res) => {
    myTestsModel.findOne().sort({ testId: -1 }).limit(1)
        .then(test => {
            res.send(test);
            // console.log("max id = " + test);
        }).catch(err => {
            res.status(500).send({
                message: 'MaxTestId error: ' + err.message
            });
        });
};

module.exports.fetchTests = (req, res) => {
    myTestsModel.find(req.query).sort({ 'testCode': 1 })
        .then(units => {
            res.send(units);
            // console.log("All Units Listed: " + units);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};