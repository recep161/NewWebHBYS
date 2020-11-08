var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    userSchema = new schema({
        userId: { type: Number, required: true, unique: true },
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: String,
        surname: String,
        personalIdNumber: { type: Number, required: true, unique: true },
        majorDicipline: String,
        userGroup: String,
        userPhotoSrc: String,
        userOldPassword: String,
        passwordChangeDate: Date,
        passwordChangeMachineName: String,
        passwordChangeMachineIp: String
    }),

    userSaveSchema = mongoose.model('users', userSchema);


module.exports = userSaveSchema;