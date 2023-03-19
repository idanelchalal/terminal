const flightModel = require('../dal/Models/Flight')

module.exports = async (req, res, next) => {
    try {
        const flightDto = new flightModel({ ...req.body }).save()
        req.flight = flightDto
        res.status(200).json({ ok: true })
        next()
    } catch (err) {
        res.sendStatus(500)
    }
}
