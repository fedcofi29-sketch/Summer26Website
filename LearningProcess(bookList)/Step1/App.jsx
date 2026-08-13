import './App.css'


const MyBooks = [
{
 "title": 'The Hunger Games',
 "author": 'Suzanne Collins',
 "id": 'GamesCollins'
},
{
 "title": "Ender's Game",
 "author": 'Orson Scott Card',
 "id": 'GameCard'
},
{
 "title": 'Foundation',
 "author": 'Isaac Asimov',
 "id": 'FoundationAsimov'
}
]


function App() {
  return (
   <div style={{ textAlign: 'center', marginTop: '50px' }}>
     <h1>Favorite Book List</h1>
       <div>
         <input type = 'text' placeholder='Enter title here...' style ={{margin: '10px'}}/>
         <input type = 'text' placeholder='Enter author here...'/> // Input boxes for title and author
         <button className='add-button'>Add</button>
       </div>
     <ul className='book-list'>
       {MyBooks.map(book => ( // Runs this for each book in the list
         <li key={book.id} className='book-item'>
           {book.title} by {book.author}
           <button className='del-button'>Delete</button>
         </li>
       ))}
     </ul>
   </div>
 )
}


export default App
