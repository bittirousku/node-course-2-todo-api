const jwt = require("jsonwebtoken");

const {ObjectID} = require("mongodb");
const {Todo} = require("../../models/todo.js");
const {User} = require("../../models/user.js");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: "tester@example.com",
  password: "firstpassw",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId, access: "auth"}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id: userTwoId,
  email: "bester@example.com",
  password: "secondpassw",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userTwoId, access: "auth"}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test",
    _creator: userOneId
  }, {
    _id: new ObjectID(),
    text: "second test",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }];


const populateTodos = (done) => {
    //remove everything before a test
    //is this cool?? it modifies the production database for testing??
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => {
      done();
    });
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();  // a promise
    let userTwo = new User(users[1]).save();  // another promise

    return Promise.all([userOne, userTwo]);
  }).then(() => {
    done();
  });
};


module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
};
