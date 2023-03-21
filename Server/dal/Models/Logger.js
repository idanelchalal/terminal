const mongoose = require('mongoose')
const schema = mongoose.Schema({
    logId: mongoose.Types.ObjectId,
    leg: [{ type: String, ref: 'Leg', path: 'phaseNumber' }],
    flight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'flightId' }],
    inDate: { type: Date, required: [true, 'Logger: In required'] },
    outDate: { type: Date },
})

module.exports = mongoose.model('Logger', schema)
