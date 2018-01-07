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
  //delete Many
  // db.collection("Todos").deleteMany({text:"Gez Eğlen"}).then((result)=>{
  //   console.log(result);
  // });
  //delete one
  // db.collection("Todos").deleteOne({text:"Gez Eğlen"}).then((result)=>{
  //   console.log(result);
  // });

  //find one and delete
  db.collection("Todos").findOneAndDelete({completed:false}).then((result)=>{
    console.log(result);
  });


  //client.close();
});
