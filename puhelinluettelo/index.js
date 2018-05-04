const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let persons = [
    { "name": "Risto Reipas",
      "number": "09-456645",
      "id": 1
    },
    { "name": "Nalle Puh",
      "number": "01-4567",
      "id": 2
    },
    { "name": "Nalle Pah",
      "number": "02-7667",
      "id": 3
    },
    { "name": "Nalle Köh",
      "number": "03-9003",
      "id": 4
    },
    { "name": "Nalle Röh",
      "number": "04-6788",
      "id": 5
    },
    { "name": "Nalle Aah",
      "number": "05-8900",
      "id": 6
    }
]

app.use(bodyParser.json())

let now = new Date
let length = persons.length
app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa on ${length} henkilön tiedot</p><p>${now}</p>`)
})

// kaiken datan hakeminen
app.get('/api/persons', (req,res) => {
    res.json(persons)
})

// id:n perusteella tietyn henkilön hakeminen
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})
  
// tietyn henkilön poistaminen id:n perusteella
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

// uuden henkilön lisääminen
app.post('/api/persons', (req, res) => {
    const person = req.body

    // virhekäsittely: ei hyväksytä tyhjää nimeä, numeroa, eikä samaa nimeä uudestaan
    if (person.name === '' || person.name === undefined || person.name === null) {
        res.status(400).json({ error: 'You must fill in the name field!'})
    } else if (person.number === '' || person.number === undefined || person.number === null) {
        res.status(400).json({ error: 'You must fill in the number field!'})
    } else if (persons.filter(h => h.name === person.name).length !== 0) {
        res.status(400).json({ error: 'Name you typed already exists!'})
    } else {
        // jos kaikki ok, generoidaan henkilölle satunnainen id
        person.id = Math.floor((Math.random() * 100) + 10) // luku 10-110
        // ja lisätään uusi henkilö 'henkilotauluun'
        persons = persons.concat(person)
        res.json(person)
    }
})

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})