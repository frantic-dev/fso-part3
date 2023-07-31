const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.MONGODB_URI

console.log("connecting to ", url)

mongoose.set("strictQuery", false)
mongoose
  .connect(url)
  .then(console.log("connected to MongoDB"))
  .catch((err) => console.log("error connecting to MongoDB", err))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator(value) {
        console.log(value)
        const numberParts = value.toString().split("-")
        const reg = new RegExp("[^0-9-]", "g").test(value)
        console.log(numberParts)

        return (
          numberParts.length === 2
          && (numberParts[0].length === 2 || numberParts[0].length === 1)
          && !reg
        )
      },
      message:
        "number must have length of 8 or more, formatted by two parts separated by a \"-\" , first part including only 2 or three numbers",
    },
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
