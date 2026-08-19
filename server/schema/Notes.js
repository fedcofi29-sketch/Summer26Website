const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Notes', notesSchema) // Allows import into index