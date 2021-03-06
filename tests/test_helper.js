const User = require('../models/user')
const Bracket = require('../models/bracket')

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

const bracketsInDb = async () => {
  const brackets = await Bracket.find({})
  return brackets
}

const newBracket = [
  {
    'game':1,
    'home':2,
    'away':1
  },
  {
    'game':2,
    'home':1,
    'away':0
  },
  {
    'game':3,
    'home':0,
    'away':0
  }
]

module.exports = {
  usersInDb, newBracket, bracketsInDb
}