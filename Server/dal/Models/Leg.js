const mongoose = require('mongoose')
const schema = mongoose.Schema({
    phaseNumber: {
        unique: [true, 'Leg: not unique'],
        type: Number,
    },
    currentFlight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }],
    nextLeg: [{ type: String, ref: 'Leg', path: 'phaseNumber' }],
    waitTime: { type: Number, required: true },
})

schema.virtual('nextLegDocs', {
    ref: 'Leg',
    localField: 'nextLeg',
    foreignField: 'phaseNumber',
    justOne: false,
})

module.exports = mongoose.model('Leg', schema)
