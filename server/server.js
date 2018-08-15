let express = require("express");
let bodyParser = require("body-parser");

let {mongoose} = require("./db/mongoose.js");
let {Todo} = require("./models/todo.js");
let {User} = require("./models/user.js");

let app = express();

//middleware:
app.use(bodyParser.json());

app.post("/todos", (request, response) => {
  let todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (err) => {
    response.status(400).send(err);
  });
});




app.listen(3000, () => {
  console.log("Started on port 3000.");
});
