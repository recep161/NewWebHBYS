var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    allDiagnosisSchema = new schema({
        icd10: { type: String, required: true },
        diagnosisName: { type: String, required: true }
    }),

    allDiagnosisSaveSchema = mongoose.model('diagnosistables', allDiagnosisSchema);


module.exports = allDiagnosisSaveSchema;