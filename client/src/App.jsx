import  './App.css'
import {useState} from 'react'
import downArrow from './assets/DownArrow.png'
import saveButton from './assets/SaveButton.png'

const myWork = [
  {
    'subject': 'English',
    'task': 'Essay',
    'due': [8, 24, 2026],
    'id': 1
  },
  {
    'subject': 'Math',
    'task': 'Worksheet',
    'due': [8, 20, 2026],
    'id': 2
  },
  {
    'subject': 'History',
    'task': 'Annotations',
    'due': [9, 1, 2026],
    'id': 3
  }
]

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const subjectColors = { // Kind of arbitrary, but this is how I set my tabgroups
  "SEL": '#921892',
  "Math": '#d32f2fa3',
  'Spanish': '#b3277b',
  'Biology': '#206b1e',
  'Mech Eng': '#d17224',
  'History': '#c7cc2f',
  'Modern': '#3f62d4',
  'English': '#a4a8c0'
}
const subjects = ["SEL", "Math", "Spanish", "Biology", "Mech Eng", "History", "Modern", "English"]

function convertToDate(month, day) { // Just learned there is a literal date input, so this might not be needed
  const monthName = Months[month-1] // Account for index starting at 0
  return `${monthName} ${day}`
}

/* I looked through the inputs and found way more than I expected. Remember to check those in the future.
    Checkbox, submit, date/time could all be useful going forward. 
      After writing that I then also found dropdowns which are really useful. */
function App() {
  const [tasks, setTasks] = useState(myWork) // Initial tasks
  const [inputSubject, setInputSubject] = useState()
  const [inputAssignment, setInputAssignment] = useState('')
  const [inputDate, setInputDate] = useState('') // Date passed through as "YYYY-MM-DD" string
  
  const handleDateChange = (e) => {
    const dateString = e.target.value
    const [year, month, day] = dateString.split('-').map(Number) // Breaks string at each hyphen and converts them to numbers
    setInputDate([day, month, year])
  }

  function handleAddClick() {
    const newHW = {
      'subject': inputSubject,
      'task': inputAssignment,
      'due': inputDate,
      'id': myWork.length + 1 // id doesn't really matter singe mongoose will eventually make them
    }

    const newIndex = findNewIndex(newHW)
    setTasks(tasks.toSpliced(newIndex, 0, newHW))
    
}
  function compareTwoDates(a, b) {
    if (a < b) {
      return true
    } else if (a > b) {
      return false
    } else {
      return 'equal'
    }
  }

  function findNewIndex(newHW) {
    let index
    for (let i = 0; i < myWork.length-1; i++) {
      isNewAYearEarlier = compareTwoDates(newHW.due[2], myWork[i].due[2])

      if (isNewAYearEarlier) { // if the new is earlier, it breaks the loop and sets this as the index
        index = i
        break
      } else if (!isNewAYearEarlier) { // if the new is later, it continues to the next item in the list
        continue
      } else { // basically the same loop but checking for months
        // there might be a way to pull this out into another function but I'm not sure how to include breaks and such then
        isNewAMonthEarlier = compareTwoDates(newHW.due[1], myWork[i].due[1])

        if (isNewAMonthEarlier) { 
          index = i
          break
        } else if (!isNewAMonthrEarlier) {
          continue
        } else { // basically the same loop but checking for days
        
          isNewADayEarlier = compareTwoDates(newHW.due[1], myWork[i].due[1])

          if (isNewADayEarlier) { 
            index = i
            break
          } else if (!isNewADayrEarlier) {
            index = i + 1 // so it adds itself to the end if it is the last item
            continue
          } else {
            // if they're due the same day I'm assuming the assingment that was put there first if from an earlier class
            index = i + 1 
        }
      }
    }
  }
  return index
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
              <option value={subject}>{subject}</option>
            ))}
          </select>
          <input type='string' placeholder='Assignment' 
          className='new-assingment-input-dimen' onChange={(e)=>setAssignment(e.target.value)}></input>
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
            <tr key={task.id} style={{backgroundColor:subjectColors[task.subject], color: 'black'}} >
              <td>{task.task}</td>
              <td>{convertToDate(task.due[0], task.due[1])}</td>
              <td> 
                <button className='utility-button'>
                {/* Not exactly sure what I'm going to use this button for exactly.
                My intial idea was to have a checkmark to remember which assignments I've finished but haven't submitted yet.
                Not sure if that's really necessary. Also could be to mark assignments I need to ask for help on
                or need long-term progress. Maybe it lights up if I've had something added for more than a certain
                period of time if I figure out how to track that. */}
                </button>
              </td>
              <td><button className='del-button'>Submitted</button></td>
              <td> 
                <div className="notes-box"> 
                  {/* putting these in a div lets them be aligned with flexbox */}
                <input type='text' placeholder='Assignment Notes...'></input>
                <button className='save-notes'>
                  <img src={saveButton} alt='Save notes'></img>
                </button>
                </div>
                </td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>
        <footer className="total-footer">Total Times Submitted: 0</footer> {/* Change this to state variable instead of 0*/}
    </div>
  )
}

export default App