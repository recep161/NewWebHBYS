var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    testSchema = new schema({
        testId: { type: Number, required: true, unique: true },
        testCode: { type: String, required: true, unique: true },
        testName: { type: String, required: true, unique: true },
        testType: { type: String, required: true },
        testLab: { type: String, required: true },
        testHint: String,
        maxRequest: String,
        testActivePassive: String
    }),

    testSaveSchema = mongoose.model('tests', testSchema);


module.exports = testSaveSchema;