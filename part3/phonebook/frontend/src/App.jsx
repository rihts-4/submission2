import { useState, useEffect } from "react"
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Notification from "./components/Notification"
import Error from "./components/Error"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleAdd = (event) => {
    event.preventDefault()
    const personObject = { 
      name: newName, 
      number: newNumber 
    }

    const person = persons.find((person) => person.name === newName)

    person === undefined ?
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`Added ${newName}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      }) 
    : window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) ?
    personService
      .update(person.id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.name === newName ? returnedPerson : person))
        setMessage(`Number of ${newName} was updated`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(
          `Information of ${newName} has already been removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setPersons(persons.filter(person => person.name !== newName))
        setNewName('')
        setNewNumber('')
      })
    : setNewName('')
    setNewNumber('')
  }

  const filteredPersons = persons.map((person) => 
    person.name.toLowerCase().includes(filter.toLowerCase()) 
    ? 
    <div key={person.id}>
      <p key={person.name}>{person.name} {person.number}</p> 
      <button key={person.id} onClick={() => deletePerson(person.id)}>delete</button>
    </div>
    : <div key={person.id}></div>
  )

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
      .deleteObject(id)
      .then(() => 
        setPersons(persons.filter(person => person.id !== id)))
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Error message={errorMessage} />
      <Filter filter={filter} handleChange={(event) => setFilter(event.target.value)} />
      <h2>add a new</h2>
      <PersonForm 
      handleAdd = {handleAdd} 
      newName={newName} handleNameChange={(event) => setNewName(event.target.value)} 
      newNumber={newNumber} handleNumberChange={(event) => setNewNumber(event.target.value)}
      />
      <h2>Numbers</h2>
      <div>
        <Persons persons={filteredPersons} />
      </div>
    </div>
  )
}

export default App