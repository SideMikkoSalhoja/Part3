import { useState, useEffect  } from 'react';
import Filter from './Filter';
import Showlist from './Showlist';
import Add from './PersonAdd';
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState({message:null, type: null})

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  const goodStyle = {
    color: 'green',
    background: 'lightgreen',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  useEffect(() => {
    personService.getAll().then(returnedPerson => {
      setPersons(returnedPerson);
    });
  }, []);

  const filtershown = newFilter === '' ? persons : 
  persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  const Notification = ({ message , type}) => {
    if (message === null) {
      return null
    }
  
    const style = type === 'error' ? errorStyle : goodStyle;

    return (
      <div style={style}>
        {message}
      </div>
    )
  }

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    }

    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase() );

    if (existingPerson)
    {
      if (window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?'))
      {   
        personService
          .update(existingPerson.id, personObject)
          .then(returnedPerson => {
           setPersons(persons.map(newPersonData => newPersonData.id === returnedPerson.id ? returnedPerson : newPersonData))
           setNewName('')
           setNewNumber('')

            setErrorMessage({message:`Number changed to '${existingPerson.name}'`, type:'good'})
            setTimeout(() => { setErrorMessage({message:null, type:null}) }, 5000)
          })
          .catch(error => {

            setErrorMessage({message:`the person '${existingPerson.name}' has been deleted from server`, type:'error'})
            setTimeout(() => { setErrorMessage({message:null, type:null}) }, 5000)

            setPersons(persons.filter(filterperson => filterperson.id !== existingPerson.id))
          })
      }
      else
        return
    }
    else
    {
      personService
        .create(personObject)
        .then(returnedPerson => {
         setPersons(persons.concat(returnedPerson))
         setNewName('')
         setNewNumber('')

          setErrorMessage({message:`Added '${personObject.name}'`, type:'good'})
          setTimeout(() => { setErrorMessage({message:null, type:null}) }, 5000)
        })
    }
  }

  const deleteSelected = (account, id) => {
    if (window.confirm(`Do you really want to delete ${account}?`)) {
      personService.deleteone(id)
      .then(returnedPerson => {
        setPersons(persons.filter(person => person.id !== returnedPerson.id))

        setErrorMessage({message:`Deleted '${account}'`, type:'good'})
        setTimeout(() => { setErrorMessage({message:null, type:null}) }, 5000)
       })
       .catch(error => {

        setErrorMessage({message:`the person '${account}' was already deleted from server`, type:'error'})
        setTimeout(() => { setErrorMessage({message:null, type:null}) }, 5000)

        setPersons(persons.filter(person => person.id !== returnedPerson.id))
       })
    }
  }

  return (
    <div>
      <Notification message={errorMessage.message} type={errorMessage.type}/>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={(event) => setNewFilter(event.target.value)} />
      <h2>Add a New</h2>
      <Add
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(event) => setNewName(event.target.value)}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <ul>
        {filtershown.map(filterpersonshow => (
        <Showlist 
          key={filterpersonshow.id} 
          showperson={filterpersonshow} 
          deletethis={ () => deleteSelected(filterpersonshow.name, filterpersonshow.id)}
          />))}
      </ul>
    </div>
  )
}

export default App
