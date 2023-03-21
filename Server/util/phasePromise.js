const { Worker, parentPort } = require('worker_threads')

const runPhaseAsync = async (workerData) => {
    const worker = new Worker(__dirname + '/phaseWorker.js', {
        workerData: workerData,
    })
    worker.on('message', (e) => {})
    worker.on('error', (e) => {})

    worker.on('exit', (code) => {
        if (code !== 0) throw new Error(`stopped with  ${code} exit code`)
    })
}

module.exports = { runPhaseAsync }
