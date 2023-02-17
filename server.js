const { v4: uuidv4 } = require('uuid');
const express = require("express");
const path = require("path");
 const fs = require("fs");
const PORT = process.env.PORT || 3001;
let db = require("./db/db.json");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    console.log(db)
    res.status(200).json(db)
}
)

app.post('/api/notes', (req, res) =>{
    console.log(req.body)
    const newNote = {
        id: uuidv4(),
        ...req.body
    }
    db.push(newNote)
    fs.writeFile("./db/db.json", JSON.stringify(db), (err)=> err ? console.log(err): res.status(200).json(db))
}
)

app.delete('/api/notes/:id', (req, res)=>{
    console.log(req.params.id)
    const newArray = db.filter(notes => notes.id !== req.params.id)
    console.log(newArray)
    fs.writeFile("./db/db.json", JSON.stringify(newArray), (err)=> err ? console.log(err): res.status(200).json(newArray))

}
)
//routes
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "./public/index.html"))
})

app.get("/notes", (req, res) => {

    res.sendFile(path.join(__dirname, "./public/notes.html"))
})



app.listen(PORT, () => {
    console.log("server has started!")
}
)

//need to put fs to do something