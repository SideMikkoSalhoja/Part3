import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Person from './models/person.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

morgan.token('newWay', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :response-time ms - :newWay'))
app.use(express.json())

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
  .then(count => { response.send(`<p>Phonebook has info for '${count}' people</p>${new Date()}`)
    })
    .catch(error => next(error)) 
  })
  
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(personfound => {if (personfound) {
    response.json(personfound)
    } else {
    response.status(404).end()
    }
  })
  .catch(error => next(error))
})  

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then( () => { response.status(204).end() })
    .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (!body || !body.name || !body.number ) 
    { return response.status(400).json( {error: 'name or number missing'} ) }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    })
  
    newPerson.save().then(savedPerson => {
      response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true }).then(person => {
    console.log(person)
    response.json(person)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001 // eslint-disable-line no-undef
app.listen(PORT)
console.log(`Server running on port ${PORT}`)