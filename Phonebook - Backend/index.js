const http = require('http')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const url =process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: Boolean,
  id: String,
})

const Person = mongoose.model('Person', PersonSchema)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "000000"
    }
]

morgan.token('newWay', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :newWay'))
app.use(express.json())

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for '${persons.length}' people</p>${new Date()}`)
  })
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personfound = persons.find(personf => personf.id === id)
    if (personfound) {
        response.json(personfound)
      } else {
        response.status(404).end()
      }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body) 
    { return response.status(400).json( {error: 'content missing'} ) }

    const isperson = persons.find(oneperson => oneperson.name.toLowerCase() === body.name.toLowerCase())

    if (!body.name || !body.number ) 
    { return response.status(400).json( {error: 'name or number missing'} ) }

    if (isperson) 
    { return response.status(400).json( {error: 'name already taken'} ) }  
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(newPerson)
    response.json(newPerson)
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)