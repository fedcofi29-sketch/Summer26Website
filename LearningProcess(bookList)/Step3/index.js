// I don't really understand what's going on here
const express = require('express')
const app = express()
const PORT = 5050

app.use(express.json())

let dummyData = [
  {
  "title": 'The Hunger Games',
  "author": 'Suzanne Collins',
  "id": 1
},
{
  "title": "Ender's Game",
  "author": 'Orson Scott Card',
  "id": 2
},
{
  "title": 'Foundation',
  "author": 'Isaac Asimov',
  "id": 3
}
]

app.get('/api/items', (req, res) => {
  res.status(200).json(dummyData)
})

app.post('/api/items', (req, res) => {
  const newItem = {
    "title": req.body.title || 'Untitled Book',
    "author": req.body.author || 'Author Unknown',
    "id": dummyData.length + 1
  }

  dummyData.push(newItem)

  res.status(201).json(newItem)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})