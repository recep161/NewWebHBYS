var express = require('express'),
    router = express.Router(),
    controllerPolExam = require('../Controllers/polExamController'),
    path = require('path');

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
router.get('/fillPatientAppointmentStatusTable', controllerPolExam.fillPatientAppointmentStatusTable);
router.get('/fillPatientUpcomingAppointmentTable', controllerPolExam.fillPatientUpcomingAppointmentTable);
router.get('/fillpolyclinicPatientCountTable', controllerPolExam.fillPolyclinicPatientCountTable);
router.get('/fillPatientHealtInsuranceTable', controllerPolExam.fillPatientHealtInsuranceTable);
router.get('/fillPatientGenderTable', controllerPolExam.fillPatientGenderTable);
router.get('/fillDoctorPatientTable', controllerPolExam.fillDoctorPatientTable);
router.get('/fillDoctorAppointmentTable', controllerPolExam.fillDoctorAppointmentTable);
router.get('/fillDoctorOnLeaveTable', controllerPolExam.fillDoctorOnLeaveTable);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;