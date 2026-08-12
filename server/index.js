// I don't really understand what's going on here
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 5050

mongoose.connect('mongodb://127.0.0.1.27017/bookList')
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
  id: {
    type: String,
    required: true
  },
})

app.use(express.json())

const Book = mongoose.model('Book', bookSchema)

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find()
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json('Failed to get books')
  }
})

function GenerateKey( title, author ){
  let titleChar = title.slice(0,3)
  let authorChar = author.slice(0,3)
  console.log(`${titleChar}${authorChar}`)
  return `${titleChar}${authorChar}`
}

app.post('/api/books', async (req, res) => {
  try {
    const newBook = Book({
    "title": req.body.title,
    "author": req.body.author,
    "id": GenerateKey(newBook.title, newBook.author)
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