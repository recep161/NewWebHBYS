var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    polyclinicAnamnesisSchema = new schema({
        patientProtocolNo: { type: Number, required: true, unique: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        appointmentStatus: String,
        patientStory: String,
        patientAnamnesis: String,
        patientExamination: String,
        patientHeight: String,
        patientWeight: String,
        patientWorkoutStyle: String,
        patientAlmasiGereken: String,
        patientKutleindexi: String,
        patientIdealKilo: String,
        patientBmr: String,
        patientSavedUser: String,
        saveDate: String,
        polyclinicSelect: String
    }),

    polyclinicAnamnesisSaveSchema = mongoose.model('polyclinicanamneses', polyclinicAnamnesisSchema);


module.exports = polyclinicAnamnesisSaveSchema;