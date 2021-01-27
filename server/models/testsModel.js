var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    testSchema = new schema({
        unitId: { type: Number, required: true, unique: true },
        unitName: { type: String, required: true, unique: true },
        unitType: { type: String, required: true },
        unitMajorDicipline: String,
        beds: String,
        unitActivePassive: String
    }),

    testSaveSchema = mongoose.model('tests', testSchema);


module.exports = testSaveSchema;