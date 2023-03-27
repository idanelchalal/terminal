const express = require('express')
const { Worker } = require('worker_threads')
const createLegs = require('./dal/legsCreator')
const config = require('./config')

const app = express()

const server = require('http').Server(app)

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

let ongoing = []
const MAX_FLIGHTS = 4
let totalFlights = 0

let worker
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/', async (req, res, next) => {
    const flightTerms = {
        isDeparture: req.body.isDeparture,
        landed: false,
    }
    if (totalFlights >= MAX_FLIGHTS) {
        return res.status(500).json({ message: 'FLIGHTS_OVERFLOW' })
    }

    console.log('totalFlights ' + totalFlights)

    totalFlights++
    worker.postMessage(flightTerms)
    res.sendStatus(200)
})

server.listen(config.PORT, async () => {
    console.log(`Server is listening on port ${config.PORT}`)
    worker = new Worker(__dirname + '/workers/threadsExecutioner.js')
    console.log('Workers Manager initialized!')
    worker.on('message', ({ payload, action }) => {
        if (action === 'flightCompleted') {
            totalFlights--
        }

        if (action === 'occupyPhase') {
            ongoing = ongoing.filter(
                (flight) =>
                    flight.flightObject.flightId !==
                    payload.flightObject.flightId
            )
            ongoing.push(payload)
        }
    })

    const onConnection = (socket) => {
        worker.on('message', (reducer) => {
            if (reducer.action !== 'FLIGHTS_OVERFLOW')
                socket.emit(reducer.action, reducer.payload)
        })
        console.log('CONNECTED IO TO CLIENT')
    }

    io.on('connection', onConnection)

    io.on('disconnect', () => {
        console.log('DISCONNECTED IO FROM CLIENT')
    })
    //     // IF FIRST TIME RUNNING THE APP EXECUTE THIS COMMAND ALSO
    //     // try {
    //     //     createLegs()
    //     // } catch (err) {
    //     //     console.log(err)
    //     // }
})
