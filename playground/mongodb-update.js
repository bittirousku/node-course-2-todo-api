const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.");
  }
  console.log("Connected to Mongodb server.");
  const db = client.db("TodoApp");

  // update eat lunch status
  // db.collection("Todos").findOneAndUpdate({
  //   _id: new ObjectID("5b73c8a79c94a4948e3a629a")
  // }, {
  //   $set: {  // have to use update operator!
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  // update user name
  db.collection("Users").findOneAndUpdate({
    name: "Kalervo"
  }, {
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((rsult) => {
    console.log(rsult);
  });

  client.close();
});
