const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.");
  }
  console.log("Connected to Mongodb server.");
  const db = client.db("TodoApp");

  // Get users with name Pentti
  // db.collection("Users").find({
  //   name: "Pentti"
  // }).toArray().then((docs) => {
  //   console.log("Pentti users:");
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("Unable to fetch todos", err);
  // });

  // Delete all "eat lunch" todos
  // db.collection("Todos").deleteMany({
  //   text: "eat lunch"
  // }).then((result) => {
  //   console.log(result)
  // });

  // Delete one "eat lunch" todo
  // db.collection("Todos").deleteOne({
  //   text: "eat lunch"
  // }).then((result) => {
  //   console.log(result)
  // });

  // Get one non-completed todo and delete it (like pop)
  // db.collection("Todos").findOneAndDelete({
  //   completed: false
  // }).then((result) => {
  //   console.log(result)
  // })

  // Delete one by id
  // db.collection("Users").deleteOne({
  //   _id: new ObjectID("5b72bc019dafa22997225885")
  // }).then((result) => {
  //   console.log(result)
  // })

  // Deletee many by name
  db.collection("Users").deleteMany({
    name: "Pentti"
  }).then((result) => {
    console.log(result);
  })




  client.close();
});
