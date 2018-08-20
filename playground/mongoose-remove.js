const {ObjectId} = require("mongodb");

const {mongoose} = require("../server/db/mongoose.js");
const {Todo} = require("../server/models/todo.js");
const {User} = require("../server/models/user.js");


let id = "5b740d2caabb962e624f591d";
let userId = "5b73f84f1eb7ca24dcab7bb8";


// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({});


Todo.findByIdAndRemove("5b7a6ec6768673b44cbf9400").then((todo) => {
  console.log(todo);
});
