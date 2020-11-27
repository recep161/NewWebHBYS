var express = require('express'),
    router = express.Router(),
    controllerPolExam = require('../Controllers/polExamController');

router.use(function (req, res, next) {
    console.log('polExamRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});


router.post('/savePolExam', controllerPolExam.savePolExam);
router.get('/getMaxProtocolNo', controllerPolExam.getMaxProtocolNo);
router.get('/findPatient', controllerPolExam.findPatient);
router.get('/findPatientHistory', controllerPolExam.findPatientHistory);
router.get('/findByProtocol', controllerPolExam.findByProtocol);
router.put('/updatePolExam', controllerPolExam.updatePolExam);
router.get('/fillPatientVisitStatisticsTable', controllerPolExam.fillPatientVisitStatisticsTable);
router.get('/fillpolyclinicPatientCountTable', controllerPolExam.fillPolyclinicPatientCountTable);
router.get('/fillPatientHealtInsuranceTable', controllerPolExam.fillPatientHealtInsuranceTable);
router.get('/fillPatientGenderTable', controllerPolExam.fillPatientGenderTable);
router.get('/fillDoctorPatientTable', controllerPolExam.fillDoctorPatientTable);
router.get('/fillDoctorOnLeaveTable', controllerPolExam.fillDoctorOnLeaveTable);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

module.exports = router;