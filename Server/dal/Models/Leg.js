const mongoose = require('mongoose')
const schema = mongoose.Schema({
    legId: mongoose.Types.ObjectId,
    currentFlight: [{ type: Schema.Types.ObjectId, ref: 'flightId' }],
    nextLeg: [{ type: mongoose.Schema.Types.ObjectId, ref: 'legId' }],
    waitTime: { type: Number, required: true },
})

module.exports = mongoose.model('Leg', schema)
