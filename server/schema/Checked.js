const mongoose = require('mongoose')
const { boolean } = require('yargs')

const checkedSchema = new mongoose.Schema({
  count: {
    type: boolean,
    required: true
  }
})

module.exports = mongoose.model('Checkbox', checkedSchema) // Allows import into index