var path = require('path');

module.exports.indexControllerGet = function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/htmls', 'index.html'))
    // res.render('index');
    console.log('index router sent me to indexController')
}

module.exports.indexControllerPost = function (req, res) {
    // res.sendFile(path.join(__dirname, '../../public/htmls', 'index.html'))
    console.log(req.body);
    res.render('index', { username: req.body.username });

    console.log('index router sent me to indexController for post')
}

module.exports.indexNotFound = function (app) {
    app.use("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
    })
}