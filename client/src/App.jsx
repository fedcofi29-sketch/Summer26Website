import  './App.css'
import {useState, useEffect} from 'react'
import downArrow from './assets/DownArrow.png'
import onBulb from './assets/LightbulbOn.png'
import offBulb from './assets/LightbulbOff.png'

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const subjectColors = { // Kind of arbitrary, but this is how I set my tabgroups
  "SEL": '#921892',
  "Math": '#c81a1ac9',
  'Spanish': '#b3277b',
  'Biology': '#58b554',
  'Mech Eng': '#d17224',
  'History': '#c7cc2f',
  'Modern': '#3f62d4',
  'English': '#a4a8c0',
  'Other': '#30aa86'
}
const subjects = ["SEL", "Math", "Spanish", "Biology", "Mech Eng", "History", "Modern", "English", "Other"]

function convertToDate(month, day) { // There's probably a way to shortcut this but it's fine for now
  const monthName = Months[month] // Date.getMonth already acounts for index
  return `${monthName} ${day}`
}


function TaskRow({task, onSubmit, postCheckbox, postNotes, postBulbs}) {
  const [notes, setNotes] = useState(task.notes || '')
  const [checked, setChecked] = useState(task.checked || false)
  const [isOn, setIsOn] = useState(task.lit || false)
  
  const dueDate = new Date(task.due) // json server data passes through as string

  const handleCheckChange = (e) => {
    const isChecked = e.target.checked
    postCheckbox(task._id, isChecked)
    setChecked(isChecked) // might be redundant amount of sets but better safe
  }

  const handleNotesChange = (e) => {
    const notes = e.target.value
    postNotes(task._id, notes)
    setNotes(notes)
  }

  function handleBulbChange() {
    const newStatus = !isOn
    setIsOn(newStatus)
    postBulbs(task._id, newStatus)
    task.lit = newStatus
  }

  return (
  <tr style={{backgroundColor:subjectColors[task.subject], color: task.lit ? 'yellow' : 'black'}} >
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
          value={notes} onChange={handleNotesChange}></input>
          <button className='lightbulb' onClick={(e)=>handleBulbChange()} style={{backgroundColor: isOn ? 'yellow' : 'white'}}>
            <img src={isOn ? onBulb : offBulb} alt='Highlight'></img>
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
  

  async function fetchData() {
    try {
      const [tasksRes, checksRes, notesRes, bulbsRes] = await Promise.all([ // Allows multiple fetch at once
        fetch('http://localhost:5050/api/tasks'),
        fetch('http://localhost:5050/api/checks'),
        fetch('http://localhost:5050/api/notes'),
        fetch('http://localhost:5050/api/bulbs')
      ])

      const taskData = await tasksRes.json() // Converts data into js
      const checkData = await checksRes.json()
      const notesData = await notesRes.json()
      const bulbsData = await bulbsRes.json()
      
      const checkMap = new Map( // creates psuedo object with faster search time. key => value
        checkData.map(c=>[c._id, c.checked]) 
      )
      const notesMap = new Map(
        notesData.map(n=>[n._id, n.note]) 
      )

      const bulbsMap = new Map(
        bulbsData.map(m=>[m._id, m.on])
      )

      // proabably a way to condense these merges
      const InitialTaskMerge = taskData.map(task=>({
        ...task,
        checked: checkMap.get(task._id) || false
      }))
      const SecondTaskMerge = InitialTaskMerge.map(task=>({
        ...task,
        notes: notesMap.get(task._id) || ''
      }))
      const mergedTasks = SecondTaskMerge.map(task=>({
        ...task,
        lit: bulbsMap.get(task._id) || false
      }))

      mergedTasks.sort((a, b) => new Date(a.due) - new Date(b.due))

      setTasks(mergedTasks)
    } catch (error) {
      console.error('Error fetching data from server:', error)
    }
  }

  useEffect(() => {
    fetchData()
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
        fetchData()
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

  async function postNotes(id, notes) { // Same as other post on this end
    try {
      const response = await fetch(`http://localhost:5050/api/notes/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({notes})
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

  async function postBulbs(id, status) { // getting kind of routine
    try {
      const response = await fetch(`http://localhost:5050/api/bulbs/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({isOn: status})
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
             postNotes={postNotes}
             postBulbs={postBulbs}
             />
          ))}
        </tbody>
        </table>
        </div>
    </div>
  )
}

export default App