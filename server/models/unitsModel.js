var mongoose = require('mongoose'),
    schema = mongoose.Schema,

    unitSchema = new schema({
        unitId: { type: Number, required: true, unique: true },
        unitName: { type: String, required: true, unique: true },
        unitType: { type: String, required: true },
        unitMajorDicipline: String,
        beds: String,
        unitActivePassive: String
    }),

    unitSaveSchema = mongoose.model('units', unitSchema);


module.exports = unitSaveSchema;