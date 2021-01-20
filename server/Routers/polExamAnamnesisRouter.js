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
router.get('/getPatientExamAnamnesisInTooltip', controllerPolExamAnamnesis.getPatientExamAnamnesisInTooltip);
router.get('/fillPatientExamHistoryTable', controllerPolExamAnamnesis.fillPatientExamHistoryTable);
router.post('/hospitalizationProcedure', controllerPolExamAnamnesis.hospitalizationProcedure);
router.get('/getBeds', controllerPolExamAnamnesis.getBeds);
router.get('/countFullandEmptyBeds', controllerPolExamAnamnesis.countFullandEmptyBeds);
router.get('/checkProtocolInpatients', controllerPolExamAnamnesis.checkProtocolInpatients);
router.post('/saveConsultation', controllerPolExamAnamnesis.saveConsultation);
router.get('/getConsultationCount', controllerPolExamAnamnesis.getConsultationCount);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;