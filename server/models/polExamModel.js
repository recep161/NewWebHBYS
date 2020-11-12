var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    polExamSchema = new schema({
        patientId: { type: Number, required: true, unique: true },
        patientIdNo: { type: Number, required: true, unique: true },
        patientName: { type: String, required: true },
        patientSurname: { type: String, required: true },
        patientFatherName: { type: String },
        patientMotherName: String,
        patientGender: String,
        patientBirthPlace: String,
        patientBirthDate: Date,
        patientPhone: String,
        patientAdress: String,
        patientPhotoSrc: String,
        patientSavedUser: String
    }),

    polExamSaveSchema = mongoose.model('polyclinicExam', polExamSchema);


module.exports = polExamSaveSchema;