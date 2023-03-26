const emitter = require('events').EventEmitter
const em = new emitter()

const finishedPhase = (structure) => em.emit('finishedPhase', structure)

const occupyPhase = (phaseNumber) => em.emit('occupyPhase', phaseNumber)

const finishedTakeOff = () => {
    em.emit('finishedTakeOff')
}

module.exports = { finishedPhase, occupyPhase, em }
