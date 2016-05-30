import http from 'http'
import throng from 'throng'
import logger from 'logfmt'
import jackrabbit from 'jackrabbit'

http.globalAgent.maxSockets = Infinity

import api from './api'

const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672'
const PORT = process.env.PORT || 3000
const SERVICE_TIME = process.env.SERVICE_TIME || 1000
const isDeveloping = process.env.NODE_ENV === 'development'

throng({ workers: 1, lifetime: Infinity }, start)

function start () {
  logger.log({ type: 'info', message: 'starting server' })

  let server
  const broker = jackrabbit(RABBIT_URL, 1)

  broker.once('connected', listen)
  broker.once('disconnected', exit.bind(this, 'disconnected'))

  process.on('SIGTERM', exit)

  function listen () {
    const app = api(SERVICE_TIME, isDeveloping)
    server = http.createServer(app)
    server.listen(PORT)
  }

  function exit (reason) {
    logger.log({ type: 'info', message: 'closing server', reason: reason })
    if (server) server.close(process.exit.bind(process))
    else process.exit()
  }
}
