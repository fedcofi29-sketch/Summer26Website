const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = 5050

mongoose.connect('mongodb://127.0.0.1:27017/HWOrganizer')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Server not connecting:', err))

app.use(cors())
app.use(express.json())

// Moved schema to another file to free up space
const Task = require('./schema/Task')
const Notes = require('./schema/Notes')
const SubmitCounter = require('./schema/SubmitCounter')

app.get('/api/HWOrganizer', async (req, res) => {
  try {
    const tasks = await Task.find() // Only picks up data that matche the schema|=> I can use more finds if I have more than one schema
    res.status(200).json(tasks)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get tasks')
  }
})

app.post('/api/HWOrganizer', async (req, res) => {
  try {
    const [subject, task, date] = req.body
    const newTask = new Task({
      'subject': subject,
      'task': task,
      'due': date,
      'added': new Date(),
    })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error('database error:', error)
    res.status(400).json('Failed to create task')
  }
})

app.delete('/api/HWOrganizer/:id', async (req, res) => {
  try {
    const {id} = req.params

    const deletedTask = await Task.findByIdAndDelete(id) // Only created if a task was deleted
    if (!deletedTask) { // Sends error message if failed
      return res.status(404).json({message: 'Task not found'})
    } 
    
    res.status(200).json({message: 'Task deleted'})
  } catch (error) {
    console.error('Error deleting task from database:', error) // Catches other errors
    res.status(500).json({message: 'Failure to delete task'})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})