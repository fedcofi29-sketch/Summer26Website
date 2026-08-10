import './App.css'
import {useState} from 'react'

const InitialBooks = [
{
  "title": 'The Hunger Games',
  "author": 'Suzanne Collins',
  "id": 'TheSuz'
},
{
  "title": "Ender's Game",
  "author": 'Orson Scott Card',
  "id": 'EndOrs'
},
{
  "title": 'Foundation',
  "author": 'Isaac Asimov',
  "id": 'FouIsa'
}
]


function InputSetup( {text, variable, variableAlter} ) {
  return (
    <input
    value={variable}
    placeholder={`Enter ${text} here...`}
    onChange={(e) => variableAlter(e.target.value)}
    />
)}

function GenerateKey( title, author ){
  let titleChar = title.slice(0,3)
  let authorChar = author.slice(0,3)
  console.log(`${titleChar}${authorChar}`)
  return `${titleChar}${authorChar}`
}


function App() {
  const [books, setBooks] = useState(InitialBooks)
  const [inputTitleValue, setInputTitleValue] = useState('')
  const [inputAuthorValue, setInputAuthorValue] = useState('')

  function OnAddClick( title, author ) {
  if (title === '' || author === '') return
    const newBook = {
      "title": title,
      "author": author,
      "id": GenerateKey(title, author)
    }
  setBooks([...books, newBook])
  setInputTitleValue('')
  setInputAuthorValue('')
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
        {books.map(book => (
          <li key={book.id} className='book-item'>
            {book.title} by {book.author}
            <button className='del-button' onClick={() => setBooks(books.filter(b => b.id !== book.id))}>
              Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App