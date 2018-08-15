// use mongoose to interact with mongodb
let mongoose = require("mongoose");

mongoose.Promise = global.Promise;  // mongoose supports promises
mongoose.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true });


module.exports.mongoose = mongoose;
