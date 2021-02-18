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
router.get('/announcementsToBottomAndTopScroll', controllerAnnouncement.announcementsToBottomAndTopScroll);
router.get('/fillAnnouncementStatusTable', controllerAnnouncement.fillAnnouncementStatusTable);
router.get('/fillAnnouncementUserGroupTable', controllerAnnouncement.fillAnnouncementUserGroupTable);
router.get('/fillAnnouncementMajorDisciplineTable', controllerAnnouncement.fillAnnouncementMajorDisciplineTable);
router.get('/fillAnnouncementClinicPolyclinicTable', controllerAnnouncement.fillAnnouncementClinicPolyclinicTable);
router.get('/fillAnnouncementExpirationDateTable', controllerAnnouncement.fillAnnouncementExpirationDateTable);


router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;