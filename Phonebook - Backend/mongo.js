const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
`mongodb+srv://tester:${password}@cluster0.tlnzq.mongodb.net/personsApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (!personName)
{
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}
else
{
    const person = new Person({
        name: personName,
        number: personNumber,
      })
      
      person.save().then(result => {
        console.log(`added ${personName} number ${personNumber} to phonebook!`)
        mongoose.connection.close()
      })
}



