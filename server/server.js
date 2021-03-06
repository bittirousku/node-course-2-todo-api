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
app.post("/todos", authenticate, (request, response) => {
  let todo = new Todo({
    text: request.body.text,
    _creator: request.user._id
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (err) => {
    response.status(400).send(err);
  });
});

// Get all todos
app.get("/todos", authenticate, (request, response) => {
  // then syntax: "then(resolve, reject)""
  // only logged in users can get todos
  // and they can only get their own todos
  Todo.find({
    _creator: request.user._id
  }).then((todos) => {
    response.send({todos});
  }, (err) => {
    response.status(400).send(err);
  });
});

// Get one todo
app.get("/todos/:id", authenticate, (request, response) => {
  let id = request.params.id;
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: request.user._id
  }).then((todo) => {
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


app.delete("/todos/:id", authenticate, async (request, response) => {
  // get id:
  const id = request.params.id;
  // validate id:
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }

  try {
    // Delete by id
    const todo = await Todo.findOneAndDelete({
      _id: id,
      _creator: request.user._id
    });
    // error if no todo exists
    if (!todo) {
      return response.status(404).send();
    }
    // return id after deleting
    response.status(200).send({todo});
  } catch (e) {
    console.log(e);
    response.status(400).send();
  }
});

app.patch("/todos/:id", authenticate, (request, response) => {
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

  Todo.findOneAndUpdate({
    _id: id,
    _creator: request.user._id
  }, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.status(200).send({todo});
  }).catch((e) => {
    response.status(400).send();
  });
});

// POST to /users
app.post("/users", async (request, response) => {
  try {
    const body = _.pick(request.body, ["email", "password"]);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    response.header("x-auth", token).send(user);
  } catch (e) {
    response.status(400).send(e);
  }
});

// Private route to get user info
app.get("/users/me", authenticate, (request, response) => {
  response.send(request.user);
});

// Login with valid credentials
// return a token in the response
app.post("/users/login", async (request, response) => {
  try {
    const body = _.pick(request.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    response.header("x-auth", token).send(user);
  } catch (e) {
    response.status(400).send();
  }
});

app.delete("/users/me/token", authenticate, async (request, response) => {
  try {
    await request.user.removeToken(request.token);
    response.status(200).send();
  } catch (e) {
    response.status(400).send();
  }
});


// Start server
app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports.app = app;
