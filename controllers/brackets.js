const bracketRouter = require('express').Router()
const Bracket = require('../models/bracket')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
//const fs = require('fs')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

bracketRouter.get('/', async (request, response) => {
  //Get only user bracket
  try {
    const token = getTokenFrom(request)
    const decodedToken =  jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const brackets = await Bracket
      .find({ user : decodedToken.id })

    response.json(brackets)
  } catch(exception){
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }

})

bracketRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    const token = getTokenFrom(request)
    const decodedToken =  jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    //Todo put empty bracket [] here, read from minidata if not put
    if (body.bracket === undefined) {
      return response.status(400).json({ error: 'Bracket missing' })
    }

    let _bracket
    if (body.bracket === ''){
      return response.status(400).json({ error: 'Bracket is empty' })
      //console.log('Adding empty bracket')
      //NOT GONNA PUT EMPTY FOR ALL USERS
      /*fs.readFile('./data/minidata.json', function(err, data) {
        if (err) throw err
        _bracket = JSON.parse(data)

      })*/
    }else{
      _bracket = body.bracket
    }
    const user = await User.findById(decodedToken.id)
    console.log(user.bracket)

    if (user.bracket) {
      return response.status(400).json({ error: 'Bracket already saved, update old' })
    }

    const bracket = new Bracket({
      bracket: _bracket,
      user: user._id
    })
    console.log('TALLENNETAAN', bracket)

    const savedBracket = await bracket.save()

    user.bracket = savedBracket._id
    console.log('NYT USeRIN BRaqKeT ', user.bracket)

    await user.save()

    response.json(savedBracket)
  } catch (exception){
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

bracketRouter.put('/:id', async (request, response) => {

  const bracket = request.body
  console.log('UPDATING WITH', bracket)

  try {
    const updatedBracket = await Bracket.findByIdAndUpdate(request.params.id, bracket)
    response.json(updatedBracket)
  } catch (error) {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  }
})
//bracketRouter.put //Update bracket

module.exports = bracketRouter