let mongoose = require("mongoose");

let Todo = mongoose.model("Todo", {
  text: {
    minlength: 2,
    required: true,
    trim: true,
    type: String
  },
  completed: {
    default: false,
    type: Boolean
  },
  completedAt: {
    default: null,
    type: Number
  }
});

// let newTodo = new Todo({
//   text: "horse around",
//   // completed: true,
//   // completedAt: 1503
// });
// let newUser = new User({
//   email: "kalervo@sposti.fi "
// });
//
// newUser.save().then((user) => {
//   console.log("Saved user", user);
// }, (err) => {
//   console.log("Unable to save user", err);
// });

module.exports.Todo = Todo;
