var express = require('express'),
    router = express.Router(),
    controllerAppointment = require('../Controllers/appointmentController');

router.use(function (req, res, next) {
    console.log('appointmentRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});

router.post('/saveAppointment', controllerAppointment.saveAppointment);
router.get('/getMaxAppointmentId', controllerAppointment.getMaxAppointmentId);
router.get('/findPatient', controllerAppointment.findPatient);
router.get('/findPatientAppointmentHistory', controllerAppointment.findPatientAppointmentHistory);
router.get('/findByAppointmentId', controllerAppointment.findByAppointmentId);
router.put('/updateAppointmentData', controllerAppointment.updateAppointmentData);
router.get('/fillPolyclinicAppointmentStatusTable', controllerAppointment.fillPolyclinicAppointmentStatusTable);
router.get('/fillCanceledValidAppointmentTable', controllerAppointment.fillCanceledValidAppointmentTable);
router.get('/fillAppointmentGenderTable', controllerAppointment.fillAppointmentGenderTable);
// router.get('/fillPatientGenderTable', controllerPolExam.fillPatientGenderTable);
// router.get('/fillDoctorPatientTable', controllerPolExam.fillDoctorPatientTable);
// router.get('/fillDoctorOnLeaveTable', controllerPolExam.fillDoctorOnLeaveTable);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

module.exports = router;