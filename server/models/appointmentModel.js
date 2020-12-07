var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    appointmentSchema = new schema({
        appointmentId: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientName: { type: String, required: true },
        patientSurname: { type: String, required: true },
        patientFatherName: { type: String, required: true },
        patientMotherName: String,
        patientGender: String,
        patientBirthPlace: String,
        patientBirthDate: String,
        appointmentDate: String,
        appointmentHour: String,
        appointmentPolyclinic: String,
        appointmentDoctor: String,
        appointmentStatus: String,
        patientSavedUser: String
    }),

    appointmentSaveSchema = mongoose.model('appointments', appointmentSchema);


module.exports = appointmentSaveSchema;