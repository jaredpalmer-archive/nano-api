const express = require('express')
const http = require('http')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.static('public'))
app.use((req, res, next) => {
  req.tenant = req.headers.host.domain.split['.'][0]
  next()
})
app.get('/', (req, res) => {
  res.send('Hello world!')
})
app.get('/api/me', (req, res) => {
  res.send(req.tenant || 'no tenant found')
})

const server = http.createServer(app)

server.listen(process.env.PORT || 5000, (err) => {
  if (err) console.log(err)
  console.log("server listening on port 5000")
})
