import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import userRoutes from '../users/routes'

function api () {
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.use(morgan('dev'))

  server.get('/', (req, res) => {
    res.send('yolo')
  })

  server.use('/v1.0/users', userRoutes)
  return server
}

export default api
