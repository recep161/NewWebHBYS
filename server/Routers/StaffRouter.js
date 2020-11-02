// module.exports = function (app) {

var express = require("express"),
    router = express.Router(),
    path = require('path'),
    staffControls = require('../Controllers/StaffController');

router.use(function (req, res, next) {
    console.log('staffRouter answer: ' + "/" + req.method);
    next();
});

router.get('/admin/staff', staffControls.redirectToStaffTab);

// Save a User to MongoDB
router.post('/staff/save', staffControls.saveStaff);

// Retrieve all Users
router.get('/admin/staff/allStaff', staffControls.findAllStaff);

// // Retrieve one User
// app.get('/staff/findOneUser', userControls.findOneUser);

// // delete User
// app.get('/staff/deleteUser', userControls.deleteUser);

// //update user photo
// app.put('/staff/updatePhoto', userControls.updatePhoto);

// // get max user id
// app.get('/staff/getMaxstaffId', userControls.getMaxUserId);

// // fill user statistics card table
// app.get('/staff/fillStaffStatisticsTable', userControls.fillUserStatisticsTable);

// app.use("/", router);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;
// }