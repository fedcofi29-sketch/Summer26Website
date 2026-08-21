const mongoose = require('mongoose')

const checkedSchema = new mongoose.Schema({
  count: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Checked', checkedSchema) // Allows import into index