const {ObjectId} = require("mongodb");

const {mongoose} = require("../server/db/mongoose.js");
const {Todo} = require("../server/models/todo.js");
const {User} = require("../server/models/user.js");


let id = "5b740d2caabb962e624f591d";
let userId = "5b73f84f1eb7ca24dcab7bb8";

// if (!ObjectId.isValid(id)) {
//   console.log("ID is not valid!");
// }

// Todo.find({
//   _id: id  // no need to convert the string to objectID in mongoose
// }).then((todos) => {
//   console.log("Todos", todos);
// });
//
//
// Todo.findOne({
//   _id: id  // no need to convert the string to objectID in mongoose
// }).then((todo) => {
//   console.log("Todo", todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log("Id not found");
//   }
//   console.log("Todo", todo);
// }).catch((err) => {
//   console.log(err);
// });


User.findById(userId).then((user) => {
  if (!user) {
    return console.log("User with id not found");
  }
  console.log("User: ", user);
}).catch((err) => {
  console.log(err);
});
