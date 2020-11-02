var routerIndex = require('./IndexRouter'),
    routerAdmin = require('./AdminRouter');

module.exports = function (app) {
    app.use('/', routerIndex);
    app.use('/admin', routerAdmin);
}