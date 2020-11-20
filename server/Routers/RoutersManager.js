var routerIndex = require('./IndexRouter'),
    routerPatient = require('./patientRouter'),
    routerPolExam = require('./polExamRouter'),
    routerAdmin = require('./AdminRouter');

module.exports = function (app) {
    app.use('/', routerIndex);
    app.use('/hastakimlik', routerPatient);
    app.use('/polExam', routerPolExam);
    app.use('/admin', routerAdmin);
};