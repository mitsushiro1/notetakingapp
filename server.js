const { v4: uuidv4 } = require('uuid');
const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const PORT = process.env.PORT || 3001;
let db = [];

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

readFileAsync('./db/db.json', 'utf8')
  .then((data) => {
    db = JSON.parse(data);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  res.status(200).json(db);
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuidv4(),
    ...req.body,
  };
  db.push(newNote);
  writeFileAsync('./db/db.json', JSON.stringify(db))
    .then(() => {
      res.status(200).json(db);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const newArray = db.filter((notes) => notes.id !== noteId);
  writeFileAsync('./db/db.json', JSON.stringify(newArray))
    .then(() => {
      db = newArray;
      res.status(200).json(newArray);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
  console.log('server has started!');
});