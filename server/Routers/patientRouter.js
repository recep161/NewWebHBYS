var express = require('express'),
    router = express.Router(),
    controllerPatient = require('../Controllers/patientController'),
    path = require('path');

router.use(function (req, res, next) {
    console.log('patientRouter answer: ' + "/" + req.method, req.url);
    next();
});


router.post('/savePatient', controllerPatient.savePatient);
router.get('/getMaxPatientId', controllerPatient.getMaxPatientId);
router.get('/findOnePatient', controllerPatient.findOnePatient);
router.put('/updatePatientData', controllerPatient.updatePatientData);
// router.get('/findLoginUser', controllerIndex.findLoginUser);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/closeUserLoginSession', controllerIndex.closeUserLoginSession);
// router.get('/userLoginStatistics', controllerIndex.userLoginStatistics);
// router.get('/getLastPasswordChangeStatistics', controllerIndex.getLastPasswordChangeStatistics);
// router.get('/checkUserPassword', controllerIndex.checkUserPassword);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;