const loggerModel = require('../dal/Models/Logger')

const loggerIn = async (flightId, phaseNumber) => {
    let outLog = new loggerModel({
        flight: flightId,
        leg: phaseNumber,
        isEntrance: true,
        date: Date.now(),
    })
    await outLog.save()
}
const loggerOut = async (flightId, phaseNumber) => {
    let outLog = new loggerModel({
        flight: flightId,
        leg: phaseNumber,
        isEntrance: false,
        date: Date.now(),
    })
    await outLog.save()
}

module.exports = { loggerIn, loggerOut }
