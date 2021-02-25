var express = require('express'),
    router = express.Router(),
    controllerDiet = require('../Controllers/dietController'),
    path = require('path');

router.use(function(req, res, next) {
    console.log('dietRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});


router.post('/saveDietAnamneses', controllerDiet.saveDietAnamneses);
router.get('/findPatientList', controllerDiet.findPatientList);
router.put('/updateDietAnamnesis', controllerDiet.updateDietAnamnesis);
router.get('/findPatientAnamnesisByProtocol', controllerDiet.findPatientAnamnesisByProtocol);
router.get('/getPatientExamAnamnesisInTooltip', controllerDiet.getPatientExamAnamnesisInTooltip);
router.get('/fillPatientExamHistoryTable', controllerDiet.fillPatientExamHistoryTable);
router.get('/fillAppointmentStatusTable', controllerDiet.fillAppointmentStatusTable);
router.get('/fillPatientHealtInsuranceTable', controllerDiet.fillPatientHealtInsuranceTable);
router.get('/fillPatientGenderTable', controllerDiet.fillPatientGenderTable);
router.get('/fillDoctorPatientTable', controllerDiet.fillDoctorPatientTable);
router.get('/fillAgePercentageTable', controllerDiet.fillAgePercentageTable);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;