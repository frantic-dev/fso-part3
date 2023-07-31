const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.MONGODB_URI;

console.log("connecting to ", url);

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(console.log("connected to MongoDB"))
  .catch((err) => console.log("error connecting to MongoDB", err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)