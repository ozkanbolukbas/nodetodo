const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return {"_id":userObject._id,"email": userObject.email};
};


userSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = "auth";
  var token =jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();
  user.tokens.push({access, token});
  return user.save().then(()=>{
    return token;
  });
};

userSchema.statics.findByToken = function (token) {

  var user = this;
  var decoded;
  try{
    decoded = jwt.verify(token, "abc123");
    console.log(decoded);
  }catch(e){
    return Promise.reject();
  }
  return user.findOne({
    "_id": decoded._id
  })
};

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
