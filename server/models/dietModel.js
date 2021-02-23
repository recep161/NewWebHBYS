var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    dietSchema = new schema({
        patientProtocolNo: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        appointmentStatus: String,
        patientStory: String,
        patientAnamnesis: String,
        patientExamination: String,
        patientSavedUser: String,
        saveDate: String,
        polyclinicSelect: String
    }),

    dietSaveSchema = mongoose.model('diet', dietSchema);


module.exports = dietSaveSchema;