const express = require('express')
const http = require('http')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.static('public'))
app.get('/api', (req, res) => {
  res.send('Hello world!')
})
app.get('/api/me', (req, res) => {
  const tenant = req.get('X-My-Custom-Param-1') || 'no tenant'
  console.log(tenant)
  res.send(tenant)
})

const server = http.createServer(app)

server.listen(process.env.PORT || 5000, (err) => {
  if (err) console.log(err)
  console.log("server listening on port 5000")
})
