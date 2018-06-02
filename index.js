const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
//bodyparser
const usersRouter= require('./controllers/users') 
const loginRouter = require('./controllers/login')
const bracketRouter = require('./controllers/brackets')

const scheduleRouter = require('./controllers/schedule')
const config = require('./utils/config')


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