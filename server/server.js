let express = require("express");
let bodyParser = require("body-parser");
const {ObjectId} = require("mongodb");

let {mongoose} = require("./db/mongoose.js");
let {Todo} = require("./models/todo.js");
let {User} = require("./models/user.js");

let app = express();
const port = process.env.PORT || 3000;

// middleware to parse JSON
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
    return response.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
        return response.status(404).send();
      }
    response.send({todo});
  }).catch((err) => {
    response.status(400).send();
  });
});
// Should use chained catches instead of error callback,
// These catch all errors


app.delete("/todos/:id", (request, response) => {
  // get id:
  let id = request.params.id;
  // validate id:
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }
  // Delete by id
  Todo.findByIdAndRemove(id).then((todo) => {
    // error if no todo exists
    if (!todo) {
      return response.status(404).send();
    }
    // return id after deleting
    response.status(200).send({todo});
  }).catch((err) => {
    // catch errors
    console.log(err);
    response.status(400).send();
  });


});


// Start server
app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports.app = app;
