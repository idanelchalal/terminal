const mongoose = require('mongoose')
const schema = mongoose.Schema({
    logId: mongoose.Types.ObjectId,
    leg: [{ type: String, ref: 'Leg', path: 'phaseNumber' }],
    flight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'flightId' }],
    isEntrance: {
        type: Boolean,
        required: [true, 'Logger: isEntrance required'],
    },
    date: { type: Date },
})

// const other = mongoose.Schema({
//     logId: mongoose.Types.ObjectId,
//     leg: [{ type: String, ref: 'Leg', path: 'phaseNumber' }],
//     flight: [{ type: mongoose.Schema.Types.ObjectId, ref: 'flightId' }],
//     inDate: { type: Date, required: [true, 'Logger: In required'] },
//     outDate: { type: Date },
// })

module.exports = mongoose.model('Logger', schema)
