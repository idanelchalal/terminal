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
let worker
let socketIO
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/', async (req, res, next) => {
    const flightTerms = {
        isDeparture: req.body.isDeparture,
        landed: false,
    }
    worker.postMessage(flightTerms)
    res.sendStatus(200)
})

server.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}`)

    worker = new Worker(__dirname + '/workers/threadsExecutioner.js')
    console.log('Workers Manager initialized!')

    io.on('connection', (socket) => {
        console.log('CONNECTED IO TO CLIENT')
        socketIO = socket
        worker.on('message', (reducer) => socketIO.emit('message', reducer))
    })

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
