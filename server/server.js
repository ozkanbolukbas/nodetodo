require("./config/config");

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Todo} =  require("./models/todo");
const {User} = require("./models/user");
const {authenticate} = require("./middleware/authenticate");

const app = express();
const port= process.env.PORT;

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
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = {
    text:req.body.text,
    completed:req.body.completed,
    completedAt:req.body.completedAt
  }

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if (body.completed===true) {
    body.completedAt = new Date().getTime();
  }else{
    body.completed=false;
    body.completedAt=null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  })
});

//POST users
app.post('/users', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  var user = new User({email, password});


  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header("x-auth", token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })
});

//POST /user/login {email, password}
app.post('/users/login', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findByCredentials(email, password).then((user)=>{
      return User.generateAuthToken().then((token)=>{
      res.header("x-auth", token).redirect("/users/me");
    });
    res.send(user);
  }).catch((e)=>{
    res.status(400).send();
  })
});


app.get('/users/me', authenticate, (req, res, next) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Server Starts on ${port}`);
});


module.exports = {app};
