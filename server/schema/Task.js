const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  due: {
    type: Date,
    required: true
  },
  added: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Task', taskSchema) // Allows import into index