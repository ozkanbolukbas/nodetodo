// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'TodoAppNew';

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
  if (err) {
    return console.log("Servera bağlanılamadı");
  }
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  //
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result)=>{
  //   assert.equal(null, err);
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  //Insert new document docs into users (name age location)
  // db.collection("Users").insertOne({
  //   name:"Özkan",
  //   age: 30,
  //   location: "Sakarya"
  // }, (err, result) =>{
  //   if (err) {
  //     return console.log("Kullanıcı kayıt edilemedi");
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // })

  client.close();
});
