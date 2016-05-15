const express = require('express')
const bodyParser = require('body-parser')
const User = require('../models/user')
const Email = require('../models/email')
const uuid = require('node-uuid')

// function server() {
const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.get('/', (req, res) => {
  res.send('yolo')
})
// const emailId = uuid.v4()
const e = new Email({
  subject: 'Yahoo is dead!',
  preheader: 'This actually happened!'
})

e.save().then((email) => console.log(email))

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

// return server
// }
//
// module.exports = server
