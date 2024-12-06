require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
  Person.findById(request.params.id).then(personfound => {if (personfound) {
    response.json(personfound)
    } else {
    response.status(404).end()
    }
  })
})  

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then( () => { response.status(204).end() })
  })

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body || !body.name || !body.number ) 
    { return response.status(400).json( {error: 'name or number missing'} ) }

    const isperson = 
    Person.findById(body.id).then(personfound => {
      if (personfound) { return response.status(400).json( {error: 'name already taken'} ) }
    })

    const newPerson = new Person({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
  
    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)