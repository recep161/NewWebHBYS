var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    userLoginSchema = new schema({
        userId: { type: Number, required: true },
        userName: { type: String, required: true },
        ipAdress: { type: String, required: true },
        computerName: String,
        sessionStartDate: String,
        sessionEndDate: String
    }),

    userLoginSessionSchema = mongoose.model('userLoginSession', userLoginSchema);


module.exports = userLoginSessionSchema;