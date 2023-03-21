const { parentPort, workerData } = require('worker_threads')
const data = workerData

parentPort.postMessage(data)
