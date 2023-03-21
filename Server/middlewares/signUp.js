const flightModel = require('../dal/Models/Flight')

module.exports = async (req, res, next) => {
    try {
        const flightDto = new flightModel({ ...req.body }).save()
        req.flight = await flightDto
        next()
    } catch (err) {
        res.sendStatus(500)
    }
}
