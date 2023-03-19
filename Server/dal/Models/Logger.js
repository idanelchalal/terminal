const mongoose = require('mongoose')
const schema = mongoose.Schema({
    logId: mongoose.Types.ObjectId,
    leg: [{ type: Schema.Types.ObjectId, ref: 'legId' }],
    flight: [{ type: Schema.Types.ObjectId, ref: 'flightId' }],
    inDate: { type: Date, required: [true, 'Logger: In required'] },
    outDate: { type: Date, required: [true, 'Logger: Out required'] },
})

module.exports = mongoose.model('Logger', schema)
