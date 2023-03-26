const { parentPort } = require('worker_threads')
const legModel = require('../dal/Models/Leg')
const flightModel = require('../dal/Models/Flight')
const { loggerIn, loggerOut } = require('../util/logger')
const config = require('../config')
const mongoConnect = require('../dal/dal')
// DAL ACCESS
mongoConnect(config.connectionString)

let currentLeg
let nextLeg
let movingFlight
let currentPhase
let isNewFlight = false

const phaseHandler = async (context) => {
    if (context.flightObject.phase === 9) {
        // LOGGING OUT LOG OF PHASE 9 ONLY!
        await loggerOut(context.flightObject.flightId, 9)
        console.log(`Flight ${context.flightObject.flightId} is taking off!`)
        parentPort.postMessage({
            action: 'flightCompleted',
            payload: context,
        })

        return
    }

    if (context.flightObject.phase === 0) context.flightObject.phase = 1
    currentPhase = context.flightObject.phase
    let movingFlightObject = { isDeparture: true, landed: false }

    if (!context.flightObject.flightId) {
        if (context.flightObject.settings) {
            movingFlightObject = {
                isDeparture: context.flightObject.settings.isDeparture,
                landed: context.flightObject.settings.landed,
            }
        }
        console.log('Creating a new flight model...')
        movingFlight = new flightModel(movingFlightObject)
        await movingFlight.save()
        isNewFlight = true
    } else
        movingFlight = await flightModel.findById(context.flightObject.flightId)

    // Attaching the movingFlight Id to the context
    context.flightObject.flightId = movingFlight._id + ''
    if (isNewFlight) {
        parentPort.postMessage({ action: 'newFlight', payload: context })
        isNewFlight = false
    }

    // Ensuring current leg is free to mount
    currentLeg = await legModel.findOne({
        phaseNumber: currentPhase,
    })
    if (currentLeg.currentFlight) {
        parentPort.postMessage({
            payload: context,
            action: 'insertFlightToQueue',
        })

        return
    }

    // LOGGING ENTRANCE TO PHASE
    if (context.flightObject.fromQueue) {
        context.flightObject.fromQueue = false
    } else {
        await loggerIn(movingFlight._id, currentLeg.phaseNumber)
    }

    parentPort.postMessage({ action: 'occupyPhase', payload: context })
    setTimeout(async () => {
        console.log(
            `Flight ${context.flightObject.flightId} is entering phase ${currentPhase}`
        )

        // Ensuring next leg is free to mount (THIS BLOCK CHECKS IF IT OCCUPIED! IF NOT CODE AFTER THIS BLOCK EXECUTED)
        nextLeg = await legModel.findOne({ phaseNumber: currentPhase + 1 })
        if (nextLeg.currentFlight) {
            parentPort.postMessage({
                payload: context,
                action: 'insertFlightToQueue',
            })

            return
        }

        if (context.flightObject.phase === 4) {
            if (!movingFlight.isDeparture) {
                console.log(
                    `Flight ${context.flightObject.flightId} is off the terminal and landed successfully.`
                )
                parentPort.postMessage({
                    action: 'flightCompleted',
                    payload: context,
                })
                await loggerOut(movingFlight._id, currentLeg.phaseNumber)
                return
            }

            if (movingFlight.isDeparture) {
                if (movingFlight.landed) {
                    console.log(
                        `Flight ${context.flightObject.flightId} is moving to the take off terminal...`
                    )
                    context.flightObject.phase = 9
                    parentPort.postMessage({
                        action: 'finishedPhase',
                        payload: context,
                    })
                    await loggerOut(movingFlight._id, currentLeg.phaseNumber)
                    return phaseHandler(context)
                }
                if (!movingFlight.landed) {
                    movingFlight.landed = true
                    await movingFlight.save()

                    context.flightObject.phase = 5

                    parentPort.postMessage({
                        action: 'finishedPhase',
                        payload: context,
                    })
                    await loggerOut(movingFlight._id, currentLeg.phaseNumber)
                    return phaseHandler(context)
                }
            }
        }

        if (context.flightObject.phase === 5) {
            const sixthLeg = await legModel.findOne({ phaseNumber: 6 })
            const seventhLeg = await legModel.findOne({ phaseNumber: 7 })
            if (!sixthLeg.currentFlight) {
                context.flightObject.phase = 6
                parentPort.postMessage({
                    action: 'finishedPhase',
                    payload: context,
                })
                await loggerOut(movingFlight._id, currentLeg.phaseNumber)
                return phaseHandler(context)
            }
            if (!seventhLeg.currentFlight) {
                context.flightObject.phase = 7
                parentPort.postMessage({
                    action: 'finishedPhase',
                    payload: context,
                })
                await loggerOut(movingFlight._id, currentLeg.phaseNumber)
                return phaseHandler(context)
            } else {
                parentPort.postMessage({
                    payload: context,
                    action: 'insertFlightToQueue',
                })

                return
            }
        }

        await loggerOut(movingFlight._id, currentLeg.phaseNumber)
        context.flightObject.phase = Number(currentLeg.nextLeg[0])
        parentPort.postMessage({ action: 'finishedPhase', payload: context })
        return phaseHandler(context)
    }, 1000 * currentLeg.waitTime)
}

parentPort.on('message', async (context) => await phaseHandler(context))
