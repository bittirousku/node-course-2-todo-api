// const MongoClient = require("mongodb").MongoClient;
// The same using ES6 object destructuring:
const {MongoClient, ObjectID} = require("mongodb");



// You don't have to create a database before using it in mongodb
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.");
  }
  console.log("Connected to Mongodb server.");
  const db = client.db("TodoApp");

  // Insert a document
  // db.collection("Todos").insertOne({
  //   text: "Something",
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log("Unable to insert todo", err);
  //   }
  //
  //   // Print the document to screen
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // Insert a new user
  db.collection("Users").insertOne({
    name: "Pentti",
    age: 15,
    location: "Piritori"
  }, (err, result) => {
    if (err) {
      return console.log("Unable to insert user", err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  });
  client.close();
});
