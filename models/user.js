const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  brackets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bracket' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    brackets: user.brackets
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User