const express = require('express')
const mongoConnect = require('./dal/dal')
const cors = require('cors')

const app = express()
app.use(express.json())

// DAL
mongoConnect(Config.connectionString, async () => {
    await app.listen(Config.PORT, () =>
        console.log(`Server is listening on port ${Config.PORT}`)
    )
})
