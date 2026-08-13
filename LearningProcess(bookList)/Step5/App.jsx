import './App.css'
import {useState} from 'react'
import {useEffect} from 'react'


function InputSetup( {text, variable, variableAlter} ) { // Textbox input
  return (
    <input
    value={variable}
    placeholder={`Enter ${text} here...`}
    onChange={(e) => variableAlter(e.target.value)}
    />
)}


function App() {
  const [books, setBooks] = useState([]) // Stores data in state so react updates
  const [inputTitleValue, setInputTitleValue] = useState('')
  const [inputAuthorValue, setInputAuthorValue] = useState('')

  async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5050/api/items') // Sends request to server for data
        const data = await response.json() // Converts data into js
        setBooks(data)
      } catch (error) {
        console.error('Error fetching data from server:', error)
      }
    }
  

  useEffect(() => { // Triggers when the app is opened
    fetchBooks()
  }, []) // [] prevents it from running everytime the page rerenders

  async function OnAddClick( title, author ) {
    if (title === '' || author === '') return // Only works if author and title both have stuff written
      try {
        const response = await fetch('http://localhost:5050/api/items', { // Sends to server
          method: 'POST', // Runs app.post in index.js w/ this data
          headers: {
            'Content-Type': 'application/json' // Tells it what type of data to receive
          },
          body: JSON.stringify({title, author}) // Formats data to send
        })
        
        const data = await response.json()
        setInputTitleValue('')
        setInputAuthorValue('')
        fetchBooks()
      } catch (error) {
        console.error('Error sending data:', error)
      }
  }

  async function OnDeleteClick(id) {
    try {
    const response = await fetch(`http://localhost:5050/api/items/${id}`, {
      method: 'DELETE' // runs app.delete in index.js w/ this data
    })
    if (response.ok) {
      setBooks(books.filter(book => book._id !== id))
    }} catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Favorite Book List</h1>
        <div className='input-div'>
          <InputSetup text='title' variable={inputTitleValue} variableAlter={setInputTitleValue}/>
          <InputSetup text='author' variable={inputAuthorValue} variableAlter={setInputAuthorValue}/>
          <button className='add-button' onClick={() => OnAddClick(inputTitleValue, inputAuthorValue)}>
            Add
            </button>
        </div>
      <ul className='book-list'>
        {books.map(book => ( // Runs this for each book in the list
          <li key={book._id} className='book-item'>
            {book.title} by {book.author}
            <button className='del-button' onClick={() => OnDeleteClick(book._id)}>
              Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
