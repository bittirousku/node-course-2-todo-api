require("./config/config.js");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectId} = require("mongodb");


const {mongoose} = require("./db/mongoose.js");
const {Todo} = require("./models/todo.js");
const {User} = require("./models/user.js");
const {authenticate} = require("./middleware/authenticate.js");

let app = express();
const port = process.env.PORT;

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

app.patch("/todos/:id", (request, response) => {
  let id = request.params.id;
  let body = _.pick(request.body, ["text", "completed"]);  // define what properties users can update
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  // completedAt property is updated by the program here, not the user
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((err) => {
    response.status(400).send();
  });
});

// POST to /users
app.post("/users", (request, response) => {
  let body = _.pick(request.body, ["email", "password"]);
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    response.header("x-auth", token).send(user);
  }).catch((err) => {
    response.status(400).send(err);
  });
});


app.get("/users/me", authenticate, (request, response) => {
  response.send(request.user);
});


// Start server
app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports.app = app;
