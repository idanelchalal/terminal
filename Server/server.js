const express = require('express')
const mongoConnect = require('./dal/dal')
const cors = require('cors')
const signUp = require('./middlewares/signUp')
const sendFlights = require('./middlewares/sendFlights')
const createLegs = require('./dal/legsCreator')
const config = require('./config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// FLIGHTS QUEUE
const queue = []

// ENDPOINT FOR THE CLIENT
app.get('/', sendFlights)

// ENDPOINT FOR THE SIMULATOR
app.post('/', signUp)

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
