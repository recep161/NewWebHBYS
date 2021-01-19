var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    inpatientSchema = new schema({
        patientProtocolNo: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        bedId: String,
        doctorSelect: String,
        hospitalizationDate: String,
        exitDate: String,
        clinicSelect: String,
        patientSavedUser: String,
        savedDate: String
    }),

    inpatientSaveSchema = mongoose.model('inpatients', inpatientSchema);


module.exports = inpatientSaveSchema;