const express = require('express')
const app = express()
const PORT = 5050

app.use(express.json())

let dummyData = [
  {
    'subject': 'English',
    'task': 'Essay',
    'due': new Date(2026, 7, 20),
    'id': 1
  },
  {
    'subject': 'Math',
    'task': 'Worksheet',
    'due': new Date(2026, 7, 24),
    'id': 2
  },
  {
    'subject': 'History',
    'task': 'Annotations',
    'due': new Date(2026, 8, 1),
    'id': 3
  }
]

app.get('/api/HW', (req, res) => {
  res.status(200).json(dummyData)
})

app.post('/api/HW', (req, res) => {
  const [subject, task, date] = req.body
  const newTask = {
    'subject': subject || 'No subject',
    'task': task || 'No task',
    'due': date ? new Date(date): 'No due date',
    'id': dummyData.length + 1
  }

  dummyData.push(newTask)

  res.status(201).json(newTask)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})