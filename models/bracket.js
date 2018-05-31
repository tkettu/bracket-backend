const mongoose = require('mongoose')

const bracketSchema = new mongoose.Schema({
  bracket: Object, //json bracket
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Bracket = mongoose.model('Bracket', bracketSchema)

module.exports = Bracket