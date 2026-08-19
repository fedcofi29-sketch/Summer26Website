const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  count: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('SubmitCounter', counterSchema) // Allows import into index