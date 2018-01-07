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

//   db.collection("Todos").find({
//     _id : new ObjectID("5a5217a73ada9b35507b7e88")
// }).toArray().then((docs)=>{
//     console.log("Yapılacaklar");
//     console.log(JSON.stringify(docs, undefined, 2));
//   }, (err)=>{
//     console.log("Yapılacaklar bulunamadı", err);
//   });

    // db.collection("Todos").find().count().then((count)=>{
    //   console.log(`Todos count:${count}`);
    //
    // }, (err)=>{
    //   console.log("Yapılacaklar bulunamadı", err);
    // });

      db.collection("Users").find({name:"Özkan"}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2));
      });

  //client.close();
});
