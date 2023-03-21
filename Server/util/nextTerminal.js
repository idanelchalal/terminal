const legModel = require('../dal/Models/Leg')
const Logger = require('../dal/Models/Logger')
const nextTerminal = async (flight, leg) => {
    let currentLeg
    let currentLog

    // ENSURING OBJECT EXISTENCE
    if (!flight) throw new Error('NO_FLIGHT_PROVIDED')
    if (!leg) currentLeg = await legModel.findOne({ phaseNumber: 1 })
    else currentLeg = leg

    // SETTING PHASE OCCUPIED
    currentLeg.currentFlight = flight
    currentLeg.save()

    // LOGGING FLIGHT ENTRANCE TO THE LEG
    try {
        currentLog = new Logger({
            leg: currentLeg.phaseNumber,
            flight: flight,
            inDate: Date.now(),
        })

        currentLog.save()
    } catch (err) {
        throw new Error(err)
    }

    // TARGETING OBJECT FROM DB
    const nextLeg = await legModel.find({ phaseNumber: currentLeg.nextLeg })

    // DELAYING THE THREAD AS LEG'S WAITING TIME
    const message =
        'ENTERING TERMINAL: ' +
        currentLeg.phaseNumber +
        '\n' +
        'FLIGHT ID: ' +
        flight._id +
        '\n' +
        'IS DEPARTURE: ' +
        flight.isDeparture +
        '\n' +
        'WAITING TIME: ' +
        currentLeg.waitTime

    console.log(message)

    const afterWaiting = async () => {
        // IF PHASE 8 DEFINETLY IT'S A DEPARTURE => A TAKE-OFF
        if (currentLeg.phaseNumber === 8) {
            currentLeg.currentFlight = null
            console.log('FLIGHT ' + flight._id + ' IS TAKING OFF!')
            await currentLeg.save()
            currentLog.outDate = Date.now()
            return
        }

        if (currentLeg.phaseNumber == 4) {
            // IF FLIGHT'S FIRST TIME ON PHASE 4 AND IT'S MEANT TO TAKE-OFF
            if (!flight.landed && flight.isDeparture) {
                flight.landed = true
                currentLeg.currentFlight = null
                currentLog.outDate = Date.now()
                await flight.save()
                await currentLeg.save()
                return nextTerminal(flight, nextLeg[0])
            }

            // IF FLIGHT IS NOT MEANT TO TAKE-OFF
            else {
                flight.landed = true
                currentLeg.currentFlight = null
                await flight.save()
                await currentLeg.save()
                currentLog.outDate = Date.now()
                console.log('PLANE IS GETTING OUT OF THE TERMINAL')
                return
            }
        }

        if (currentLeg.phaseNumber == 5) {
            // ENSURE PHASE IS 6 FREE OTHERWISE CHECK PHASE 7
            if (!nextLeg[0].currentFlight) {
                currentLog.outDate = Date.now()
                currentLeg.currentFlight = null
                await currentLeg.save()
                return nextTerminal(flight, nextLeg[0])
            }

            // GOING INTO PHASE 7 OTHERWISE CANNOT CONTINUE
            if (nextLeg[1] && !nextLeg[1].currentFlight) {
                currentLeg.currentFlight = null
                currentLog.outDate = Date.now()
                await currentLeg.save()
                return nextTerminal(flight, nextLeg[1])
            }

            // IF PHASES 6 AND 7 ARE OCCUPIED => WAITING
            else {
                console.log('6 AND 7 ARE OCCUPIED')
                return
            }
        }

        if (!nextLeg[0].currentFlight) {
            currentLeg.currentFlight = null
            currentLog.outDate = Date.now()
            await currentLog.save()
            await currentLeg.save()
            return nextTerminal(flight, nextLeg[0])
        } else {
            console.log('NEXT PHASE BLOCKED')
            return
        }
    }
    setTimeout(afterWaiting, currentLeg.waitTime * 1000)
    // log.save()
}

// ADDING outDate TO CURRENT LOG

module.exports = { nextTerminal }
