// Using envv to protect password
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = 5050

console.log(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas Cloud'))
.catch((err) => console.log('Server not connecting:', err))

app.use(cors())
app.use(express.json())

// Moved schema to another file to free up space
const Task = require('./schema/Task')
const Notes = require('./schema/Notes')
const Checked = require('./schema/Checked')

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find() // Only picks up data that matche the schema|=> I can use more finds if I have more than one schema
    res.status(200).json(tasks)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get tasks')
  }
})

app.post('/api/tasks', async (req, res) => { // changed route to allow different types of post
  try {
    const {subject, assignment, due} = req.body
    
    const [year, month, day] = due.split('-').map(Number)
    const checkDate = new Date(year, month - 1, day)
    if (isNaN(checkDate.getTime())) {
      return res.status(400).json('Invalid date format')
    }

    const newTask = new Task({
      'subject': subject,
      'task': assignment,
      'due': checkDate,
      'added': new Date(),
    })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error('database error:', error)
    res.status(400).json('Failed to create task')
  }
})

app.get('/api/checks', async (req, res) => { // Same as other get. Not sure if there's more ways to make it
  try {
    const checks = await Checked.find()
    res.status(200).json(checks)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get checks')
  }
})

app.post('/api/checks/:id', async (req, res) => {
  try {
    const {id} = req.params // passing id to identify if it's a new checkbox or existing one
    const {isChecked} = req.body
    
    const updatedCheck = await Checked.findByIdAndUpdate(
      id,
      {checked: isChecked},
      {returnDocument: 'after', upsert: true} // Creates a new Check if one doesn't exist with this id
    )
    res.status(201).json(updatedCheck)
  } catch (error) {
    console.error('database error:', error)
    res.status(400).json('Failed to update check')
  }
})

app.delete('/api/HWOrganizer/:id', async (req, res) => {
  try {
    const {id} = req.params

    const deletedTask = await Task.findByIdAndDelete(id) // Only created if a task was deleted
    if (!deletedTask) { // Sends error message if failed
      return res.status(404).json({message: 'Task not found'})
    } 

    const deletedCheck = await Checked.findByIdAndDelete(id)
    if (!deletedCheck) { // Sends error message if failed
      return res.status(404).json({message: 'Checkbox not found'})
    } 
    
    res.status(200).json({message: 'Both deleted'})
  } catch (error) {
    console.error('Error deleting from database:', error) // Catches other errors
    res.status(500).json({message: 'Failure to delete something'})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})