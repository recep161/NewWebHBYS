var express = require('express'),
    router = express.Router(),
    controllerAdmin = require('../Controllers/AdminController.js'),
    controllerStaff = require('../Controllers/StaffController'),
    controllerUsers = require('../Controllers/userController');


router.use(function (req, res, next) {
    console.log('adminRouter answer: ' + "/" + req.method);
    next();
});

// admin main page
router.get('/', controllerAdmin.adminControllerGet);

// user routes
router.get('/user', controllerUsers.redirectToUserTab);
router.post('/user/save', controllerUsers.saveUser);
router.get('/user/findOneUser', controllerUsers.findOneUser);
router.get('/user/checkUserFromDatabase', controllerUsers.checkUserFromDatabase);
router.get('/user/deleteUser', controllerUsers.deleteUser);
router.put('/user/resetPassword', controllerUsers.resetPassword);
router.put('/user/updateUserData', controllerUsers.updateUserData);
router.put('/user/updatePhoto', controllerUsers.updatePhoto);
router.get('/user/getMaxUserId', controllerUsers.getMaxUserId);
router.get('/user/all', controllerUsers.findAllUsers);
router.get('/user/fillUserStatisticsTable', controllerUsers.fillUserStatisticsTable);
router.get('/user/fillStaffStatisticsTable', controllerStaff.fillStaffStatisticsTable); // for staff statistic table
router.get('/user/countTableAndRows', controllerStaff.countTableAndRows);

// staff routes
router.get('/staff', controllerStaff.redirectToStaffTab);
router.post('/staff/save', controllerStaff.saveStaff);
router.get('/staff/findAllStaffs', controllerStaff.findAllStaff);
router.get('/staff/findOneStaff', controllerStaff.findOneStaff);
router.get('/staff/checkStaffFromDatabase', controllerStaff.checkStaffFromDatabase);
router.get('/staff/deleteStaff', controllerStaff.deleteStaff);
router.put('/staff/updateStaffData', controllerStaff.updateStaffData);
router.put('/staff/updatePhoto', controllerStaff.updatePhoto);
router.get('/staff/getMaxStaffId', controllerStaff.getMaxStaffId);
router.get('/staff/fillStaffStatisticsTable', controllerStaff.fillStaffStatisticsTable);
router.get('/staff/countTableAndRows', controllerStaff.countTableAndRows);
router.get('/staff/fillStafOnLeaveTable', controllerStaff.fillStafOnLeaveTable);

module.exports = router;