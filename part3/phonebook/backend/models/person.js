const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to database')
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB', result.connection.name)
  })
  .catch(error => console.log('error connecting to MongoDB:', error.message)
  )

const numberValidator = (number) => {
  return /\d{2,3}-\d{6,}/.test(number)
}

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is an invalid phone number`
    }
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phonebookSchema)

