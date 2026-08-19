const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  counter: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('SubmitCounter', counterSchema) // Allows import into index