// I don't really understand what's going on here
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5050

mongoose.connect('mongodb://127.0.0.1:27017/bookList')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Server not connecting:', err))

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
})

app.use(express.json())

const Book = mongoose.model('Book', bookSchema)

app.get('/api/items', async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get books')
  }
})

app.post('/api/items', async (req, res) => {
  try {
    const newBook = new Book({
    "title": req.body.title,
    "author": req.body.author,
  }) 
    const savedBook = await newBook.save()
    res.status(201).json(savedBook)
  } catch (error) {
    res.status(400).json('Failed to create book')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})