const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://frantic_dev:${password}@frantic-dev.jgxiw65.mongodb.net/PhonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((people) => {
    console.log("phonebook:");
    people.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
