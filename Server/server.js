const express = require('express')
const mongoConnect = require('./dal/dal')
const { runPhaseAsync } = require('./util/phasePromise')
const { Worker, workerData } = require('worker_threads')

const { Mutex } = require('async-mutex')
const cors = require('cors')
const signUp = require('./middlewares/signUp')
const sendFlights = require('./middlewares/sendFlights')
const createLegs = require('./dal/legsCreator')
const config = require('./config')
const { nextTerminal } = require('./util/nextTerminal')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// FLIGHTS QUEUE
const queue = []

// ENDPOINT FOR THE CLIENT
app.get('/', sendFlights)

// ENDPOINT FOR THE SIMULATOR
app.post('/', signUp)
app.use('/', (req, res) => nextTerminal(req.flight))

// app.use(async (req, res, next) => {
//     const flight = await req.flight
//     const worker = await runPhaseAsync(JSON.stringify(flight))
// })

// DAL
mongoConnect(config.connectionString, async () => {
    await app.listen(config.PORT, () => {
        console.log(`Server is listening on port ${config.PORT}`)
        // IF FIRST TIME RUNNING THE APP EXECUTE THIS COMMAND ALSO
        // try {
        //     createLegs()
        // } catch (err) {
        //     console.log(err)
        // }
    })
})
