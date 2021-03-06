const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter= require('./controllers/users')
const loginRouter = require('./controllers/login')
const bracketRouter = require('./controllers/brackets')

const scheduleRouter = require('./controllers/schedule').scheduleRouter
const teamRouter = require('./controllers/schedule').teamRouter
const groupRouter = require('./controllers/schedule').groupRouter
const knockoutRouter =  require('./controllers/schedule').knockoutRouter
const config = require('./utils/config')

const morgan = require('morgan')
morgan.token('data', function getData (res){return JSON.stringify(res.body)})
app.use(morgan('tiny'))
app.use(morgan(':data'))

mongoose
  .connect(config.mongoUrl)
  .then( () => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch( err => {
    console.log(err)
  })

app.use(cors())
app.use(bodyParser.json())

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/brackets', bracketRouter)
app.use('/api/schedule', scheduleRouter)
app.use('/api/groups', groupRouter)
app.use('/api/teams', teamRouter)
app.use('/api/knockout', knockoutRouter)


const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
  console.log('database connection closed')
})

module.exports = {
  app, server
}