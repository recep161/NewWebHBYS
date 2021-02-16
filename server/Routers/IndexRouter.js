var express = require('express'),
    router = express.Router(),
    controllerIndex = require('../Controllers/IndexController.js'),
    path = require('path');

router.use(function (req, res, next) {
    console.log('indexRouter answer: ' + "/" + req.method, req.url);
    next();
});

router.get('/', controllerIndex.indexControllerGet);
router.get('/admin', controllerIndex.indexRedirectToAdmin);
router.get('/hastakimlik', controllerIndex.indexRedirectToHastaKimlik);
router.get('/polExam', controllerIndex.indexRedirectToPolExam);
router.get('/polExamAnamnesis', controllerIndex.indexRedirectToPolExamAnamnesis);
router.get('/announcement', controllerIndex.indexRedirectToAnnouncement);
router.get('/appSave', controllerIndex.indexRedirectToAppointmentSave);
router.get('/findLoginUser', controllerIndex.findLoginUser);
router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
router.put('/closeUserLoginSession', controllerIndex.closeUserLoginSession);
router.get('/userLoginStatistics', controllerIndex.userLoginStatistics);
router.get('/getLastPasswordChangeStatistics', controllerIndex.getLastPasswordChangeStatistics);
router.get('/checkUserPassword', controllerIndex.checkUserPassword);
router.put('/changeUserPassword', controllerIndex.changeUserPassword);

// router.use("/*", (req, res) => {
//     res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
// });

module.exports = router;