const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.set('strictQuery',false)
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'what u doing'],
    minlength: [3, 'name was too short (3 marks)'],
  },
  number: {
    type: String,
    required: [true, 'Number missing'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{5,}$/.test(v);
      },
      message: 'not valid',
    },
  },
})

PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', PersonSchema)