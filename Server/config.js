const dotenv = require('dotenv').config().parsed

const config = {
    DB_USER: process.env.DB_USER,
    SECRET_STRING: process.env.SECRET_STRING,
    DB_PASS: process.env.DB_PASS,
    PORT: process.env.NODE_PORT,
    connectionString: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.slcl1ik.mongodb.net/terminal?retryWrites=true&w=majority`,
}

module.exports = config
