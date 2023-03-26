const express = require('express')
const mongoConnect = require('./dal/dal')
const { Worker, workerData } = require('worker_threads')
const cors = require('cors')
const signUp = require('./middlewares/signUp')
const sendFlights = require('./middlewares/sendFlights')
const createLegs = require('./dal/legsCreator')
const config = require('./config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// MAIN WORKER REFERENCE
let worker
let db

// FLIGHTS QUEUE
const flightsQueue = []
const threadPool = []

// ENDPOINT FOR THE CLIENT
app.get('/', sendFlights)

app.post('/', async (req, res, next) => {
    const flightTerms = {
        isDeparture: req.body.isDeparture,
        landed: false,
    }
    worker.postMessage(flightTerms)
    worker.on('message', (context) =>
        res.status(context.status).json({ message: context.message })
    )
})

app.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}`)

    worker = new Worker(__dirname + '/workers/threadsExecutioner.js')
    console.log('Workers Manager initialized!')

    //     // IF FIRST TIME RUNNING THE APP EXECUTE THIS COMMAND ALSO
    //     // try {
    //     //     createLegs()
    //     // } catch (err) {
    //     //     console.log(err)
    //     // }
})
