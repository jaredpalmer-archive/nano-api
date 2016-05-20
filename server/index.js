import express from 'express'
import bodyParser from 'body-parser'
import uuid from 'node-uuid'
import morgan from 'morgan'
import emailRoutes from '../email/routes'
import http from 'http'
import config from '../config'
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(morgan('dev'))

server.get('/', (req, res) => {
  res.send('yolo')
})

server.use('/v1.0/emails', emailRoutes)

http.createServer(server).listen(5000)

// return server
// }
//
// module.exports = server
// Email.create({
//   id: emailId,
//   subject: 'Yahoo is dead!',
// }).then((res) =>{
//   return User.create({
//     email: 'shelly@palmer.net',
//     firstName: 'Shelly',
//   })
// }).then(user => {
//   return User.openEmail('shelly@palmer.net', emailId)
// }).catch(e => console.log(e))

// User.find().then(res => console.log(res))
// User.findByEmail('brent@palmer.net')
//   .then(res => {
//     console.log(res[0].get('n.email'))
//     console.log(res[0].get('n.firstName'))
//   })
//   .catch(e => console.log(e))

// User.findByEmailAndUpdate('brent@palmer.net', { email: 'jared@palmer.net' })
//   .then(res => {
//     // console.log(res[0].get('n.email'))
//     // console.log(res[0].get('n.firstName'))
//     console.log(res[0])
//   })
//   .catch(e => console.log(e))
//
