const mongoose = require('mongoose')
const schema = mongoose.Schema({
    isDeparture: { required: true, type: Boolean },
    landed: { required: true, default: false, type: Boolean },
    // passengersCount: {
    //     type: Number,
    //     required: true,
    //     min: [10, 'A flight cannot departure with less than 10 passengers.'],
    //     max: [100, 'A flight cannot departure with more than 100 passengers.'],
    // },
    // brandName: { required: false, default: 'UNKOWN', type: String },
})

module.exports = mongoose.model('Flight', schema)
