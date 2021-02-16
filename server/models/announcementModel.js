var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    announcementSchema = new schema({
        announcementId: { type: Number, required: true, unique: true },
        announcementTitle: { type: String, required: true },
        announcementUserGroup: { type: String, required: true },
        announcementUserMajorDiscipline: String,
        announcementUserClinic: String,
        announcementStartDate: String,
        announcementEndDate: String,
        announcementShowTime: String,
        announcementActivePasive: String,
        announcementText: String,
        announcementSavedUser: String
    }),

    announcementSaveSchema = mongoose.model('announcements', announcementSchema);


module.exports = announcementSaveSchema;