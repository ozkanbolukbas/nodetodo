const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});
var Todo= mongoose.model("Todo", todoSchema);

module.exports = {Todo};

// var otherTodo = new Todo({
//   text: "Something to do"
// });
// otherTodo.save().then((doc)=>{
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) =>{
//   console.log("Kayıt edilemedi");
// })
