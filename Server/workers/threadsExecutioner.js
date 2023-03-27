const { Worker, parentPort } = require('worker_threads')
const mongoConnect = require('../dal/dal')
const flightModel = require('../dal/Models/Flight')
const legModel = require('../dal/Models/Leg')
const config = require('../config')

// DAL ACCESS
mongoConnect(config.connectionString, async () => {
    console.log('CONNECTED TO DATABASE!')
    const legsCleaner = async () => {
        const legs = await legModel.find()
        for (const leg of legs) {
            leg.currentFlight = null
            leg.save()
        }
    }
    await legsCleaner()
})

// Flight Object
const flightObject = {
    flightId: null,
    phase: 0,
}

// MEMORY VARIABLES

let flightsQueue = []
const threadPool = []
let occupiedPhases = []

// Workers Reducer
const reducer = async ({ action, payload }) => {
    parentPort.postMessage({ action, payload })

    if (action === 'insertFlightToQueue') {
        console.log(
            `Adding flight ${payload.flightObject.flightId} to flights-queue`
        )
        let isAlreadyInQueue =
            flightsQueue.findIndex(
                (flight) =>
                    flight.flightObject.flightId ===
                    payload.flightObject.flightId
            ) > -1
        if (!isAlreadyInQueue) {
            payload.fromQueue = true
            flightsQueue.push(payload)
        }
        return
    }

    if (action === 'flightCompleted') {
        const leg = await legModel.findOne({
            phaseNumber: payload.flightObject.phase,
        })
        leg.currentFlight = null
        await leg.save()
        parentPort.postMessage({ action: 'flightCompleted', payload })
    }

    if (action === 'occupyPhase') {
        const flight = await flightModel.findById(payload.flightObject.flightId)
        const leg = await legModel.findOne({
            phaseNumber: payload.flightObject.phase,
        })
        leg.currentFlight = flight
        await leg.save()
        occupiedPhases.push(payload.flightObject.phase)
        return
    }

    if (action === 'finishedPhase') {
        // Expecting to receive a phase number of the next phase hence phase number should be subtracted by one.
        // EX: phaseNumber - 1
        let movingFlight = await flightModel.findById(
            payload.flightObject.flightId
        )
        let phaseToBeFree = payload.flightObject.phase - 1
        if (
            payload.flightObject.phase == 6 ||
            payload.flightObject.phase == 7
        ) {
            phaseToBeFree = 5
        }

        if (payload.flightObject.phase == 4) {
            if (movingFlight.landed) {
                phaseToBeFree = 8
            } else {
                phaseToBeFree = 3
            }
        }

        if (payload.flightObject.phase == 8) {
            let anotherLeg = await legModel.findOne({
                currentFlight: payload.flightObject.flightId,
            })
            phaseToBeFree = anotherLeg.phaseNumber
        }
        if (payload.flightObject.phase == 9) {
            phaseToBeFree = 4
        }

        const leg = await legModel.findOne({
            phaseNumber: phaseToBeFree,
        })
        leg.currentFlight = null
        await leg.save()

        occupiedPhases = occupiedPhases.filter(
            (phase) => phase !== phaseToBeFree
        )

        // Making sure the queued flights will know if they can get in
        let lastPhase = phaseToBeFree
        let queuedFlightIndex
        if (flightsQueue.length <= 0) return
        for (let i = phaseToBeFree; i > 0; i--) {
            queuedFlightIndex = flightsQueue.findIndex(
                (queued) => queued.flightObject.phase === phaseToBeFree
            )

            if (queuedFlightIndex !== -1) {
                // Sending it to the workers factory.
                workerFactory(flightsQueue[queuedFlightIndex].flightObject)
                console.log(
                    `Flight ${flightsQueue[queuedFlightIndex].flightObject.flightId} is released from the queue!`
                )

                // Cleaning the array
                flightsQueue = flightsQueue.filter(
                    (flight) =>
                        flight.flightObject.flightId !==
                        flightsQueue[queuedFlightIndex].flightObject.flightId
                )

                return
            }
        }
    }
}

const workerFactory = (context) => {
    // if (totalFlights > MAX_FLIGHTS) {
    //     parentPort.postMessage({ action: 'FLIGHTS_OVERFLOW' })
    // }

    const pathPrefix = __dirname + '/'
    const workerIndex =
        threadPool.push(new Worker(pathPrefix + 'flightManager.js')) - 1

    threadPool[workerIndex].postMessage({ flightObject: context })
    threadPool[workerIndex].on('error', (err) => console.log(err))
    threadPool[workerIndex].on('message', reducer)
}

// WHEN A NEW REQUEST IS INCOMING
parentPort.on('message', async (context) => {
    workerFactory({ ...flightObject, settings: context })
})
