const express = require('express');
const bodyParser = require('body-parser');


const {mongoose} = require("./db/mongoose");
const {Todo} =  require("./models/todo");
const {User} = require("./models/user");

const app = express();
const port= 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/todos', (req, res, next) => {
    var todo= new Todo({
      text: req.body.text
    });
    todo.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(e);
    })
});








app.listen(port, () => {
  console.log(`Server Starts on ${port}`);
});
