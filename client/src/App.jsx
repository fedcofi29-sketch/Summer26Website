import  './App.css'
import {useState} from 'react'
import downArrow from './assets/DownArrow.png'
import saveButton from './assets/SaveButton.png'

const myWork = [
  {
    'subject': 'English',
    'task': 'Essay',
    'due': new Date(2026, 7, 20), // Turning these into datestrings as well to try and simplify the code
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


function TaskRow({task, onSubmit}) {
  const [notes, setNotes] = useState('')
  
  return (
  <tr style={{backgroundColor:subjectColors[task.subject], color: 'black'}} >
    <td>{task.task}</td>
    <td>{convertToDate(task.due.getMonth(), task.due.getDate())}</td>
    <td> 
      <button className='utility-button'>
        {/* Not exactly sure what I'm going to use this button for exactly.
        My intial idea was to have a checkmark to remember which assignments I've finished but haven't submitted yet.
        Not sure if that's really necessary. Also could be to mark assignments I need to ask for help on
        or need long-term progress. Maybe it lights up if I've had something added for more than a certain
        period of time if I figure out how to track that. */}
        </button>
      </td>
      <td><button className='submit-button' onClick={()=>onSubmit(task.id)}>
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
  const [tasks, setTasks] = useState(myWork) // Initial tasks
  const [inputSubject, setInputSubject] = useState()
  const [inputAssignment, setInputAssignment] = useState('')
  const [inputDate, setInputDate] = useState('') // Date passed through as "YYYY-MM-DD" string
  const [totalSubmitted, setTotalSubmitted] = useState(0)
  
  const handleDateChange = (e) => {
    const dateString = e.target.value
    const [year, month, day] = dateString.split('-').map(Number) // converts to numbers before Date() to stop timezone differnces
    const dateObject = new Date(year, month-1, day) // accounts for month index
    console.log(dateObject)
    setInputDate(dateObject)
  }

  function handleAddClick() {
    const newHW = {
      'subject': inputSubject,
      'task': inputAssignment,
      'due': inputDate,
      'id': tasks.length + 1 // id doesn't really matter since mongoose will eventually make them
    }

    const newIndex = findNewIndex(newHW)
    setTasks(tasks.toSpliced(newIndex, 0, newHW))
}
  
  const handleSubmit = (id) => {
    setTasks(tasks.filter(t=>t.id!==id))
    setTotalSubmitted(totalSubmitted + 1)
  }
  function findNewIndex(newHW) {
    // I initially had several layers of if else before I learned about date objects and getTime
    let index
    for (let i = 0; i < tasks.length; i++) {
      const isNewEarlier = compareTwoDates(newHW.due.getTime(), tasks[i].due.getTime())

      if (isNewEarlier > 0) { // if the new is earlier, it breaks the loop and sets this as the index
        index = i
        break
      } else if (isNewEarlier < 0) { // if the new is later, it continues to the next item in the list
        index = i + 1 // this way the last item goes to the end
        continue
      } else { // if they're due the same day I want the one I've had for longer to be on top
        index = i + 1
        break
      }
    }
  return index
  }

  function compareTwoDates(a, b) { // Switched to numbers because 'equal' string was counting as true
    if (a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  }

  return (
    <div className="overall-page"> {/* encompasses everything to account for footer */}
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
          <input type='string' placeholder='Assignment'
          className='new-assingment-input-dimen' onChange={(e)=>setInputAssignment(e.target.value)}></input>
          <input type='date' className='new-assignment-input-dimen' 
          style={{cursor: 'pointer'}} onChange={handleDateChange}></input>
          <button className='add-new-task' onClick={handleAddClick}>
            <img src={downArrow} alt="Add new task"></img>
            </button>
        </div>
        {/* I think it just looks nicer to only have divisions this way */}
        {/* Not really sure what tbody does but it gives me an error message if I don't have it */}
        <table className='vertical-lines'> 
        <tbody> 
          {tasks.map(task => (
            <TaskRow
             key={task.id}
             task={task}
             onSubmit={handleSubmit}
             />
          ))}
        </tbody>
        </table>
        </div>
        <footer className="total-footer">Total Times Submitted: {totalSubmitted}</footer> 
    </div>
  )
}

export default App