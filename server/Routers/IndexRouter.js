
var express = require('express'),
    router = express.Router(),
    controllerIndex = require('../Controllers/IndexController.js');

router.use(function (req, res, next) {
    console.log('indexRouter answer: ' + "/" + req.method, req.url);
    next();
});


router.get('/', controllerIndex.indexControllerGet);
router.get('/findLoginUser', controllerIndex.findLoginUser);
router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
router.put('/closeUserLoginSession', controllerIndex.closeUserLoginSession);
router.get('/userLoginStatistics', controllerIndex.userLoginStatistics);

module.exports = router;