var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    patientsSchema = new schema({
        patientId: { type: Number, required: true, unique: true },
        patientIdNo: { type: Number, required: true, unique: true },
        patientName: { type: String, required: true },
        patientSurname: { type: String, required: true },
        patientFatherName: { type: String },
        patientMotherName: String,
        patientGender: String,
        patientBirthPlace: String,
        patientBirthDate: String,
        patientPhone: String,
        patientAdress: String,
        patientPhotoSrc: String,
        patientSavedUser: String
    }),

    patientsSaveSchema = mongoose.model('patients', patientsSchema);


module.exports = patientsSaveSchema;