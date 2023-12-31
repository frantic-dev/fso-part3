const express = require("express")

const app = express()
const morgan = require("morgan")
const cors = require("cors")

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body",
)
morgan.token("body", (req, res) => JSON.stringify(req.body))

app.use(express.static("dist"))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

const Person = require("./models/person")

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => response.send(`<p>phonebook has info for ${
    persons.length
  } people</p> <p>${new Date()} (${
    Intl.DateTimeFormat().resolvedOptions().timeZone
  })</p>
    `))
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((persons) => {
      if (persons) {
        response.json(persons)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
  Person.find({}).then((persons) => {
    const { body } = request
    const uniqueName = persons.find((person) => person.name === body.name)

    if (!body.name) {
      return response.status(400).json({
        error: "name missing",
      })
    } if (!body.number) {
      return response.status(400).json({
        error: "number missing",
      })
    } if (uniqueName) {
      return response.status(400).json({
        error: "name must be unique",
      })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then((savedPerson) => response.json(savedPerson))
      .catch((error) => next(error))
  })
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const { body } = request

  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: "mal formatted id" })
  } if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// currently pushing latest version to render 3.21 deploying database backend to production
