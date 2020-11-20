var express = require("express"),
    router = express.Router(),
    path = require('path');

const userControls = require('../Controllers/userController');

router.use(function (req, res, next) {
    console.log('userRouter answer: ' + "/" + req.method);
    next();
});

// Save a User to MongoDB
router.post('/user/save', userControls.saveUser);

// Retrieve all Users
router.get('/user/all', userControls.findAllUsers);

// Retrieve one User
router.get('/user/findOneUser', userControls.findOneUser);

// delete User
router.get('/user/deleteUser', userControls.deleteUser);

// reset password
router.put('/user/resetPassword', userControls.resetPassword);

//update user photo
router.put('/user/updatePhoto', userControls.updatePhoto);

// get max user id
router.get('/user/getMaxUserId', userControls.getMaxUserId);

// fill user statistics card table
router.get('/admin/user/fillUserStatisticsTable', userControls.fillUserStatisticsTable);

// app.use("/", router);

router.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/htmls/404.html'));
});

module.exports = router;