const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const mongoConnect = async (connectionString, callback) => {
    const client = await mongoose.connect(connectionString)

    if (callback) callback(client)

    // const client = await mongoose.connect(connectionString, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // })
    // if (callback) callback()
    // console.log(client)
    // return client.client
}

module.exports = mongoConnect
