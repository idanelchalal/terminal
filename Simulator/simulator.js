const express = require('express')
const axios = require('axios')
const app = express()

let requestCounter = 0
const MAX_REQUESTS = 10

app.listen(3002, () => {
    console.log('Server running on port 3002')
})

function sendPostRequest() {
    const isDeparture = Math.random() < 0.5 // randomly choose true or false
    const data = { isDeparture }
    const headers = { 'Content-Type': 'application/json' }
    axios
        .post('http://localhost:3001', data, { headers })
        .then(() => {
            console.log(`Sent POST request with data: ${JSON.stringify(data)}`)
            requestCounter++
            if (requestCounter < MAX_REQUESTS) {
                setTimeout(
                    sendPostRequest,
                    Math.floor(Math.random() * 10000) + 5000
                ) // random interval between 5-15 seconds
            }
        })
        .catch((err) => {
            console.error(`Error sending POST request: ${err.message}`)
        })
}

sendPostRequest()
