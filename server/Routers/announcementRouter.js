var express = require('express'),
    router = express.Router(),
    controllerAnnouncement = require('../Controllers/announcementController'),
    path = require('path');

router.use(function (req, res, next) {
    console.log('announcementRouter answer: ' + "/" + req.method + ' - ' + req.url);
    next();
});


router.post('/saveAnnouncement', controllerAnnouncement.saveAnnouncement);
router.get('/getMaxAnnouncementId', controllerAnnouncement.getMaxAnnouncementId);
router.get('/findAnnouncementHistory', controllerAnnouncement.findAnnouncementHistory);
router.get('/findByAnnouncementId', controllerAnnouncement.findByAnnouncementId);
router.put('/updateAnnouncementData', controllerAnnouncement.updateAnnouncementData);
// router.get('/fillPatientVisitStatisticsTable', controllerAnnouncement.fillPatientVisitStatisticsTable);
// router.get('/fillPatientAppointmentStatusTable', controllerAnnouncement.fillPatientAppointmentStatusTable);
// router.get('/fillPatientUpcomingAppointmentTable', controllerAnnouncement.fillPatientUpcomingAppointmentTable);
// router.get('/fillpolyclinicPatientCountTable', controllerAnnouncement.fillPolyclinicPatientCountTable);
// router.get('/fillPatientHealtInsuranceTable', controllerAnnouncement.fillPatientHealtInsuranceTable);
// router.get('/fillPatientGenderTable', controllerAnnouncement.fillPatientGenderTable);
// router.get('/fillDoctorPatientTable', controllerAnnouncement.fillDoctorPatientTable);
// router.get('/fillDoctorAppointmentTable', controllerAnnouncement.fillDoctorAppointmentTable);
// router.get('/fillDoctorOnLeaveTable', controllerAnnouncement.fillDoctorOnLeaveTable);
// router.post('/userLoginSessionSave', controllerIndex.userLoginSessionSave);
// router.put('/changeUserPassword', controllerIndex.changeUserPassword);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;