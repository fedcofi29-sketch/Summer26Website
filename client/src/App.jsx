import  './App.css'
import {useState, useEffect} from 'react'
import downArrow from './assets/DownArrow.png'
import saveButton from './assets/SaveButton.png'

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const subjectColors = { // Kind of arbitrary, but this is how I set my tabgroups
  "SEL": '#921892',
  "Math": '#c81a1ac9',
  'Spanish': '#b3277b',
  'Biology': '#206b1e',
  'Mech Eng': '#d17224',
  'History': '#c7cc2f',
  'Modern': '#3f62d4',
  'English': '#a4a8c0'
}
const subjects = ["SEL", "Math", "Spanish", "Biology", "Mech Eng", "History", "Modern", "English"]

function convertToDate(month, day) { // There's probably a way to shortcut this but it's fine for now
  const monthName = Months[month] // Date.getMonth already acounts for index
  return `${monthName} ${day}`
}


function TaskRow({task, onSubmit, postCheckbox}) {
  const [notes, setNotes] = useState('')
  const [checked, setChecked] = useState(task.checked || false)
  
  const dueDate = new Date(task.due) // json server data passes through as string

  const handleCheckChange = (e) => {
    const isChecked = e.target.checked
    postCheckbox(task._id, isChecked)
    setChecked(isChecked)
  }

  return (
  <tr style={{backgroundColor:subjectColors[task.subject], color: 'black'}} >
    <td>{task.task}</td>
    <td>{convertToDate(dueDate.getMonth(), dueDate.getDate())}</td>
    <td> 
      <input type="checkbox" className="checkbox" checked={checked} onChange={handleCheckChange}></input>
      </td>
      <td><button className='submit-button' onClick={()=>onSubmit(task._id)}>
        {/* The button filters out the task that matches its id */}Submitted</button></td>
      <td> 
        <div className="notes-box"> 
          {/* putting these in a div lets them be aligned with flexbox */}
          <input type='text' placeholder='Assignment Notes...' 
          value={notes} onChange={(e)=>setNotes(e.target.value)}></input>
          <button className='save-notes'>
            <img src={saveButton} alt='Save notes'></img>
          </button>
        </div>
      </td>
  </tr>)
}
/* I looked through the inputs and found way more than I expected. Remember to check those in the future.
    Checkbox, submit, date/time could all be useful going forward. 
      After writing that I then also found dropdowns which are really useful. */
function App() {
  const [tasks, setTasks] = useState([]) // Set to database on useEffect
  const [inputSubject, setInputSubject] = useState()
  const [inputAssignment, setInputAssignment] = useState('')
  const [inputDate, setInputDate] = useState('') // Date passed through as "YYYY-MM-DD" string
  const [totalSubmitted, setTotalSubmitted] = useState(0)
  
  async function fetchTasks() { // This is the same as it was in the bookList
    try {
        const response = await fetch('http://localhost:5050/api/HWOrganizer') // Sends request to server for data
        const data = await response.json() // Converts data into js
        
        if (Array.isArray(data)) {
          data.sort((a, b) => new Date(a.due) - new Date(b.due)) 
          // Compares each task's date to each other and sorts the earliest first       
          setTasks(data)
        } else {
          console.error('Expected array, received:', data)
        }
      } catch (error) {
        console.error('Error fetching data from server:', error)
      }
  }

  useEffect(() => {
    fetchTasks()
  }, []) // [] prevents this from running each time the page rerenders

  const handleDateChange = (e) => {
    setInputDate(e.target.value)
  }

  async function handleAddClick(subject, assignment, due) { // This is the same as it was in the bookList
    if (!subject || subject === "Subject" || !assignment || !due) return // Won't add if one of the variables is blank
      try {
        const response = await fetch('http://localhost:5050/api/tasks', { // Sends to server
          method: 'POST', // Runs app.post in index.js w/ this data
          headers: {
            'Content-Type': 'application/json' // Tells it what type of data to receive
          },
          body: JSON.stringify({subject, assignment, due}) // Formats data to send
        })   
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Server error:', errorData)
          return
        }
        /* I'm not reseting the inputs because I think it will make more sense if they stay
          Don't really have a reason beyond it seeming more natural */
        fetchTasks()
      } catch (error) {
        console.error('Error sending data:', error)
      }
  }
  
  
  async function handleSubmit(id) { // This is the same as in bookList
    try {
    const response = await fetch(`http://localhost:5050/api/HWOrganizer/${id}`, {
      method: 'DELETE' // runs app.delete in index.js w/ this data
    })
    if (response.ok) {
      setTasks(tasks.filter(task => task._id !== id))
    }} catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  async function postCheckbox(id, status) { // Same as other post on this end
    try {
      const response = await fetch(`http://localhost:5050/api/checks/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({isChecked: status})
      })
      if (!response.ok) {
          const errorData = await response.json()
          console.error('Server error:', errorData)
          return
        }
    } catch (error) {
      console.error('Error sending data:', error)
    }
  }

  return (
    <div className="overall-page"> {/* encompasses everything to account for footer: leaving it despite removing the footer in case I change my mind */}
      <div style={{flex: '1'}}> {/* this div is everything but the footer */}
      <h1 className='hw-heading'>Homework</h1>
        <div className='input-div'>
          <select defaultValue="Subject" onChange={(e)=>setInputSubject(e.target.value)} style={{cursor: 'pointer'}}> 
            {/* this can be set to have a color based on the selected subjects once states are added to track the value */}
            <option value="Subject" disabled>Subject</option>
            {subjects.map(subject => (
              <option key={subject}value={subject}>{subject}</option>
            ))}
          </select>
          <input type='text' placeholder='Assignment'
          className='new-assingment-input-dimen' onChange={(e)=>setInputAssignment(e.target.value)}></input>
          <input type='date' className='new-assignment-input-dimen' 
          style={{cursor: 'pointer'}} onChange={handleDateChange}></input>
          <button className='add-new-task' onClick={()=>handleAddClick(inputSubject, inputAssignment, inputDate)}>
            <img src={downArrow} alt="Add new task"></img>
            </button>
        </div>
        {/* I think it just looks nicer to only have divisions this way */}
        {/* Not really sure what tbody does but it gives me an error message if I don't have it */}
        <table className='vertical-lines'> 
        <tbody> 
          {tasks.map(task => (
            <TaskRow // Made this its own function to allow state creation. Also helps organize
             key={task._id}
             task={task}
             onSubmit={handleSubmit}
             postCheckbox={postCheckbox}
             />
          ))}
        </tbody>
        </table>
        </div>
    </div>
  )
}

export default App