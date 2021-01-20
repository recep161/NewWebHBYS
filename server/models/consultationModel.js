var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    consultationSchema = new schema({
        patientProtocolNo: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        doctorSelect: String,
        consultationDate: String,
        acceptDate: String,
        clinicSelect: String,
        consultationNote: String,
        patientSavedUser: String,
        savedDate: String
    }),

    consultationSaveSchema = mongoose.model('consultations', consultationSchema);


module.exports = consultationSaveSchema;