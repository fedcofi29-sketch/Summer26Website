const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5050

mongoose.connect('mongodb://127.0.0.1:27017/HWOrganizer')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Server not connecting:', err))

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

app.use(express.json())

const Task = mongoose.model('Task', taskSchema)

app.get('/api/HW', async (req, res) => {
  try {
    const tasks = await Task.find() // Only picks up data that matche the schema|=> I can use more finds if I have more than one schema
    res.status(200).json(tasks)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get tasks')
  }
})

app.post('/api/HW', async (req, res) => {
  try {
    const [subject, task, date] = req.body
    const newTask = Task({
      'subject': subject,
      'task': task,
      'due': date,
      'added': Date(),
    })
    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    console.error('database error:', error)
    res.status(400).json('Failed to create task')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})