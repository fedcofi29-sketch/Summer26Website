import  './App.css'
import {useState} from 'react'
import downArrow from './assets/DownArrow.png'
import saveButton from './assets/SaveButton.png'

const myWork = [
  {
    'subject': 'English',
    'task': 'Essay',
    'due': [8, 24],
    'id': 1
  },
  {
    'subject': 'Math',
    'task': 'Worksheet',
    'due': [8, 20],
    'id': 2
  },
  {
    'subject': 'History',
    'task': 'Annotations',
    'due': [9, 1],
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
      After writing this I then also found dropdowns which are really useful. */
function App() {
  return (
    <div className="overall-page"> {/* encompasses everything to account for footer */}
      <div style={{flex: '1'}}> {/* this div is everything but the footer */}
      <h1 className='hw-heading'>Homework</h1>
        <div className='input-div'>
          <select defaultValue="Subject" style={{cursor: 'pointer'}}> 
            {/* this can be set to have a color based on the selected subjects once states are added to track the value */}
            <option value="Subject" disabled>Subject</option>
            {subjects.map(subject => (
              <option value={subject}>{subject}</option>
            ))}
          </select>
          <input type = 'string' placeholder = 'Assignment' className='new-assingment-input-dimen'></input>
          <input type = 'date' className='new-assignment-input-dimen' style={{cursor: 'pointer'}}></input>
          <button className='add-new-task'>
            <img src={downArrow} alt="Add new task"></img>
            </button>
        </div>
        <table className='vertical-lines'> {/* I think it just looks nicer to only have divisions this way */}
        <tbody> {/* Not really sure what tbody does but it gives me an error message if I don't have it */}
          {myWork.map(work => (
            <tr key={work.id} style={{backgroundColor:subjectColors[work.subject], color: 'black'}} >
              <td>{work.task}</td>
              <td>{convertToDate(work.due[0], work.due[1])}</td>
              <td><button className='utility-button'></button></td>
              {/* Not exactly sure what I'm going to use this button for exactly.
                My intial idea was to have a checkmark to remember which assignments I've finished but haven't submitted yet.
                Not sure if that's really necessary. Also could be to mark assignments I need to ask for help on
                or need long-term progress. Maybe it lights up if I've had something added for more than a certain
                period of time if I figure out how to track that. */}
              <td><button className='del-button'>Submitted</button></td>
              <td>
                <div className="notes-box"> {/* putting these in a div lets them be aligned with flexbox */}
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