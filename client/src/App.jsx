import  './App.css'

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

function convertToDate(month, day) { // Just learned there is a literal date input, so this might not be needed
  const monthName = Months[month-1] // Account for index starting at 0
  return `${monthName} ${day}`
}

/* I looked through the inputs and found way more than I expected. Remember to check those in the future.
    Checkbox, submit, date/time could all be useful going forward */
function App() {
  return (
    <div>
      <h1 className='hw-heading'>Homework</h1>
        <div className='input-div'>
          <input type = 'string' placeholder = 'Subject'></input>
          <input type = 'string' placeholder = 'Assignment'></input>
          <input type = 'date'></input>
        </div>
        <table className='vertical-lines'> {/* I think it just looks nicer to only have divisions this way */}
        <thead> {/* Not really sure what thead does but it gives me an error message if I don't have it */}
          {myWork.map(work => (
            <tr key={work.id} >
              <td>{work.task}</td>
              <td>{convertToDate(work.due[0], work.due[1])}</td>
              <td><button className='utility-button'></button></td>
              {/* Not exactly sure what I'm going to use this button for exactly.
                My intial idea was to have a checkmark to remember which assignments I've finished but haven't submitted yet.
                Not sure if that's really necessary. Also could be to mark assignments I need to ask for help on
                or need long-term progress. Maybe it lights up if I've had something added for more than a certain
                period of time if I figure out how to track that. */}
              <td><button className='del-button'>Submitted</button></td>
            </tr>
          ))}
        </thead>
        </table>
    </div>

  )
}

export default App