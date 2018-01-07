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

  // db.collection("Todos").findOneAndUpdate({
  //   _id: new ObjectID("5a5221923ada9b35507b7e96")
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

  db.collection("Users").findOneAndUpdate({
    _id : new ObjectID("5a521489f0606b59ac6e59fc")
  }, {
    $set: {
      name: "Nihat"
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result)=>{
    console.log(result);
  });

  //client.close();
});
