var routerIndex = require('./IndexRouter'),
    routerPatient = require('./patientRouter'),
    routerAdmin = require('./AdminRouter');

module.exports = function (app) {
    app.use('/', routerIndex);
    app.use('/hastakimlik', routerPatient);
    app.use('/admin', routerAdmin);
}