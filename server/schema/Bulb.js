// same schema as the check but I need it to be diff since they will have the same id
const mongoose = require('mongoose')

const bulbSchema = new mongoose.Schema({
  on: {
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Bulb', bulbSchema) // Allows import into index