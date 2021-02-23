var express = require('express'),
    router = express.Router(),
    controllerDiet = require('../Controllers/dietController'),
    path = require('path');

router.use(function(req, res, next) {
    console.log('dietRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});


router.post('/savePolExamAnamnesis', controllerDiet.savePolExamAnamnesis);
router.get('/getPatientPersonalIdNo', controllerDiet.getPatientPersonalIdNo);
router.get('/getPatientDataToCookie', controllerDiet.getPatientDataToCookie);
router.get('/findPatientList', controllerDiet.findPatientList);
router.get('/checkPatientAppointmentStatus', controllerDiet.checkPatientAppointmentStatus);
router.get('/diagnosisList', controllerDiet.diagnosisList);
router.get('/findPatientDiagnosisHistory', controllerDiet.findPatientDiagnosisHistory);
router.post('/savePolExamDiagnosis', controllerDiet.savePolExamDiagnosis);
router.get('/deletePatientDiagnosis', controllerDiet.deletePatientDiagnosis);
router.put('/updateDiagnosisType', controllerDiet.updateDiagnosisType);
router.put('/updatePolExamAnamnesis', controllerDiet.updatePolExamAnamnesis);
router.get('/findPatientAnamnesisByProtocol', controllerDiet.findPatientAnamnesisByProtocol);
router.get('/getPatientExamAnamnesisInTooltip', controllerDiet.getPatientExamAnamnesisInTooltip);
router.get('/fillPatientExamHistoryTable', controllerDiet.fillPatientExamHistoryTable);
router.get('/fillPatientLabRadHistoryTable', controllerDiet.fillPatientLabRadHistoryTable);
router.post('/hospitalizationProcedure', controllerDiet.hospitalizationProcedure);
router.get('/getBeds', controllerDiet.getBeds);
router.get('/countFullandEmptyBeds', controllerDiet.countFullandEmptyBeds);
router.get('/checkProtocolInpatients', controllerDiet.checkProtocolInpatients);
router.post('/saveConsultation', controllerDiet.saveConsultation);
router.get('/getConsultationCount', controllerDiet.getConsultationCount);
router.get('/fillConsultationHistoryTable', controllerDiet.fillConsultationHistoryTable);
router.post('/savePatientRadLabExaminations', controllerDiet.savePatientRadLabExaminations);
router.get('/fillAppointmentStatusTable', controllerDiet.fillAppointmentStatusTable);
router.get('/fillPatientHealtInsuranceTable', controllerDiet.fillPatientHealtInsuranceTable);
router.get('/fillPatientGenderTable', controllerDiet.fillPatientGenderTable);
router.get('/fillDoctorPatientTable', controllerDiet.fillDoctorPatientTable);
router.get('/fillAgePercentageTable', controllerDiet.fillAgePercentageTable);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;