const express = require('express') // Server runs on
const mongoose = require('mongoose') // This is where the data gets sent
const cors = require('cors') // Allows data to be shared
const app = express()
app.use(cors())
const PORT = 5050

mongoose.connect('mongodb://127.0.0.1:27017/bookList') // My database
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Server not connecting:', err))

const bookSchema = new mongoose.Schema({ // All data has to fit this format
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
    const books = await Book.find() // Looks for data being passed through that matches the schema
    res.status(200).json(books)
  } catch (error) {
    console.error('database error:', error)
    res.status(500).json('Failed to get books')
  }
})

app.post('/api/items', async (req, res) => {
  try {
    const newBook = new Book({ // Format that processes data
    "title": req.body.title,
    "author": req.body.author,
  }) 
    const savedBook = await newBook.save()
    res.status(201).json(savedBook)
  } catch (error) {
    res.status(400).json('Failed to create book')
  }
})

app.delete('/api/items/:id', async (req, res) => {
  try {
    const {id} = req.params

    const deletedBook = await Book.findByIdAndDelete(id) // Only created if a book is deleted
    if (!deletedBook) { // Sends error message if failed
      return res.status(404).json({message: 'Book not found'})
    } 
    
    res.status(200).json({message: 'Book deleted'})
  } catch (error) {
    console.error('Error deleting book from database:', error) // Catches other errors
    res.status(500).json({message: 'Failure to delete book'})
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})