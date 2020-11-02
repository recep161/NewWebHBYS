
    var express = require('express'),
        router = express.Router(),
        controllerIndex = require('../Controllers/IndexController.js');

    router.use(function (req, res, next) {
        console.log('userRouter answer: ' + "/" + req.method);
        next();
    });


    router.get('/', controllerIndex.indexControllerGet);
    router.post('/server/views/index', controllerIndex.indexControllerPost);

    module.exports = router;