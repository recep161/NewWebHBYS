var express = require('express'),
    router = express.Router(),
    controllerPolExamAnamnesis = require('../Controllers/polExamAnamnesisController'),
    path = require('path');

router.use(function (req, res, next) {
    console.log('polExamAnamnesisRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});


router.post('/savePolExamAnamnesis', controllerPolExamAnamnesis.savePolExamAnamnesis);
router.get('/getPatientPersonalIdNo', controllerPolExamAnamnesis.getPatientPersonalIdNo);
router.get('/getPatientDataToCookie', controllerPolExamAnamnesis.getPatientDataToCookie);
router.get('/findPatientList', controllerPolExamAnamnesis.findPatientList);
router.get('/diagnosisList', controllerPolExamAnamnesis.diagnosisList);
router.get('/findPatientDiagnosisHistory', controllerPolExamAnamnesis.findPatientDiagnosisHistory);
router.post('/savePolExamDiagnosis', controllerPolExamAnamnesis.savePolExamDiagnosis);
router.get('/deletePatientDiagnosis', controllerPolExamAnamnesis.deletePatientDiagnosis);
router.put('/updateDiagnosisType', controllerPolExamAnamnesis.updateDiagnosisType);
router.put('/updatePolExamAnamnesis', controllerPolExamAnamnesis.updatePolExamAnamnesis);
router.get('/findPatientAnamnesisByProtocol', controllerPolExamAnamnesis.findPatientAnamnesisByProtocol);
// router.get('/fillPatientAppointmentStatusTable', controllerPolExam.fillPatientAppointmentStatusTable);
// router.get('/fillPatientUpcomingAppointmentTable', controllerPolExam.fillPatientUpcomingAppointmentTable);
// router.get('/fillpolyclinicPatientCountTable', controllerPolExam.fillPolyclinicPatientCountTable);
// router.get('/fillPatientHealtInsuranceTable', controllerPolExam.fillPatientHealtInsuranceTable);
// router.get('/fillPatientGenderTable', controllerPolExam.fillPatientGenderTable);
// router.get('/fillDoctorPatientTable', controllerPolExam.fillDoctorPatientTable);
// router.get('/fillDoctorAppointmentTable', controllerPolExam.fillDoctorAppointmentTable);
// router.get('/fillDoctorOnLeaveTable', controllerPolExam.fillDoctorOnLeaveTable);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;