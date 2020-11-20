var express = require('express'),
    router = express.Router(),
    controllerPolExam = require('../Controllers/polExamController');

router.use(function (req, res, next) {
    console.log('polExamRouter answer: ' + "/" + req.method, req.url);
    next();
});


router.post('/savePolExam', controllerPolExam.savePolExam);
router.get('/getMaxProtocolNo', controllerPolExam.getMaxProtocolNo);
router.get('/findPatient', controllerPolExam.findPatient);
router.get('/findPatientHistory', controllerPolExam.findPatientHistory);
router.get('/findByProtocol', controllerPolExam.findByProtocol);
// router.put('/updatePatientData', controllerPolExam.updatePatientData);
// router.get('/findLoginUser', controllerIndex.findLoginUser);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/closeUserLoginSession', controllerIndex.closeUserLoginSession);
// router.get('/userLoginStatistics', controllerIndex.userLoginStatistics);
// router.get('/getLastPasswordChangeStatistics', controllerIndex.getLastPasswordChangeStatistics);
// router.get('/checkUserPassword', controllerIndex.checkUserPassword);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

module.exports = router;