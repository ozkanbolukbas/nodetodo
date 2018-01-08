const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
});

var User = mongoose.model("User", userSchema);

module.exports = {User};
// var user = new User({
//   email: "ozkan@example.com            "
// });
// user.save().then((doc)=>{
//   console.log("Kullanıcı kayıt edildi", doc);
// }, (e)=>{
//   console.log("Kullanıcı kayıt edilemedi", e);
// })
