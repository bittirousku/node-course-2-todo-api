const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.");
  }
  console.log("Connected to Mongodb server.");
  const db = client.db("TodoApp");

  // Get record with known ID
  // db.collection("Todos").find({
  //   _id: new ObjectID("5b72c327fbae9b1569bc1b56")
  // }).toArray().then((docs) => {
  //   console.log("List of Todos:");
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("Unable to fetch todos", err);
  // });

  // Get count of records:
  // db.collection("Todos").find().count().then((count) => {
  //   console.log("Number of Todos: " + count);
  // }, (err) => {
  //   console.log("Unable to fetch todos", err);
  // });

  // Get users with name Pentti
  db.collection("Users").find({
    name: "Pentti"
  }).toArray().then((docs) => {
    console.log("Pentti users:");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch todos", err);
  });

  client.close();
});
