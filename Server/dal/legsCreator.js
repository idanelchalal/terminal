const legModel = require('./Models/Leg')
const createLegs = () => {
    let lastLeg = null
    for (let i = 1; i < 10; i++) {
        const nextLegs = (i) => {
            if (i === 4) return [5, 9]
            if (i === 5) return [6, 7]
            if (i === 8) return [4]
            if (i === 9) return []
            return [i + 1]
        }
        let leg = new legModel({
            phaseNumber: i,
            nextLeg: nextLegs(i),
            currentFlight: null,
            waitTime: 5,
        }).save((err) => {
            throw new Error(err)
        })
    }
}

module.exports = createLegs
