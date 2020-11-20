var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    polExamSchema = new schema({
        patientProtocolNo: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        patientFatherName: { type: String, required: true },
        patientMotherName: String,
        patientGender: String,
        patientBirthPlace: String,
        patientBirthDate: String,
        patientSavedUser: String,
        patientPolExamDate: String,
        polyclinicSelect: String,
        doctorSelector: String,
        statusSelect: String
    }),

    polExamSaveSchema = mongoose.model('polyclinicExam', polExamSchema);


module.exports = polExamSaveSchema;