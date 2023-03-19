const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const mongoConnect = (connectionString, callback) => {
    mongoose
        .connect(connectionString)
        .then((client) => {
            console.log('Connected to database!')
            callback()
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
}

module.exports = mongoConnect
