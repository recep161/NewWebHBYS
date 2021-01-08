var routerIndex = require('./IndexRouter'),
    routerPatient = require('./patientRouter'),
    routerPolExam = require('./polExamRouter'),
    routerPolExamAnamnesis = require('./polExamAnamnesisRouter'),
    routerAppointment = require('./appointmentRouter'),
    routerAdmin = require('./AdminRouter');

module.exports = function (app) {
    app.use('/', routerIndex);
    app.use('/admin', routerAdmin);
    app.use('/hastakimlik', routerPatient);
    app.use('/polExam', routerPolExam);
    app.use('/polExamAnamnesis', routerPolExamAnamnesis);
    app.use('/appSave', routerAppointment);
};
