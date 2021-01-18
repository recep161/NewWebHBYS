var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    patientDiagnosisSchema = new schema({
        patientProtocolNo: { type: Number, required: true},
        patientIdNo: { type: Number, required: true },
        patientId: { type: Number, required: true },
        icd10: { type: String, required: true },
        diagnosisType: { type: String, required: true },
        diagnosisName: { type: String, required: true },
        diagnosisUser: { type: String, required: true },
        diagnosisDate: { type: String, required: true }
    }),

    patientDiagnosisSaveSchema = mongoose.model('patientdiagnoses', patientDiagnosisSchema);


module.exports = patientDiagnosisSaveSchema;

