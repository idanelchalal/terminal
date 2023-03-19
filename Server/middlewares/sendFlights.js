const leg = require('../dal/Models/Leg')
module.exports = async (req, res, next) => {
    try {
        const allData = await leg.find()
        res.status(200).json(allData)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}
