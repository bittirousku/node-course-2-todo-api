let express = require("express");
let bodyParser = require("body-parser");
const {ObjectId} = require("mongodb");

let {mongoose} = require("./db/mongoose.js");
let {Todo} = require("./models/todo.js");
let {User} = require("./models/user.js");

let app = express();

//middleware:
app.use(bodyParser.json());

// Create new todo
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

// Get all todos
app.get("/todos", (request, response) => {
  // then(resolve, reject)
  Todo.find().then((todos) => {
    response.send({todos});
  }, (err) => {
    response.status(400).send(err);
  });
});

// Get one todo
app.get("/todos/:id", (request, response) => {
  let id = request.params.id;
  if (!ObjectId.isValid(id)) {
    return response.send({
      status: "Error",
      errorMessage: "Invalid ID"
    });
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
        return response.send({
          "status": "Error",
          "errorMessage": "Todo not found"
        });
      }
    response.send({todo});
  }).catch((err) => {
    response.status(400).send();
  });
});
// Should use chained catches instead of erro callback,
// These catch all errors



app.listen(3000, () => {
  console.log("Started on port 3000.");
});

module.exports.app = app;
