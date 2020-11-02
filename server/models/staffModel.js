var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    staffSchema = new schema({
        staffId: { type: Number, required: true, unique: true },
        staffIdNumber: { type: Number, required: true, unique: true },
        staffName: String,
        staffSurname: String,
        staffDiplomaNo: String,
        majorDicipline: String,
        staffGroup: String,
        staffPhotoSrc: String,
        staffLeaveStartDate: Date,
        staffLeaveEndDate: Date
    }),

    staffSaveSchema = mongoose.model('staffs', staffSchema);


module.exports = staffSaveSchema;