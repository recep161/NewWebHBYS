var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    patientRadLabSchema = new schema({
        patientProtocolNo: { type: Number, required: true },
        patientId: { type: Number, required: true },
        patientIdNo: { type: Number, required: true },
        patientNameSurname: { type: String, required: true },
        testCode: { type: String, required: true },
        testName: { type: String, required: true },
        testLab: { type: String, required: true },
        testQuantity: { type: String, required: true },
        testType: { type: String, required: true },
        saveDate: { type: String, required: true },
        result: { type: String },
        resultDate: { type: String },
        resultUser: { type: String }
    }),

    patientRadLabSaveSchema = mongoose.model('patientradlabtest', patientRadLabSchema);


module.exports = patientRadLabSaveSchema;