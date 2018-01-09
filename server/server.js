const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Todo} =  require("./models/todo");
const {User} = require("./models/user");

const app = express();
const port= process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/todos', (req, res) => {
    var todo= new Todo({
      text: req.body.text
    });
    todo.save().then((doc)=>{
      res.send(doc);
    },(e)=>{
      res.status(400).send(e);
    })
});

app.get('/todos', (req, res, next) => {
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res, next) => {
  var id= req.params.id;

  //Validate id using isValid
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });

});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if (!todo) {
      return res.status(404).send();
    }
    res.send(todo);
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.listen(port, () => {
  console.log(`Server Starts on ${port}`);
});


module.exports = {app};
